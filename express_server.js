const express = require("express");
const app = express();
const PORT = 8000; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const cookieSession = require("cookie-session");
const {
  generateRandomString,
  checkEmailFromUsers,
  checkEmailAndPasswordForLogin,
  urlsForUser,
  checkEmailAndPasswordFromUsers
} = require("./helpers");
const { urlDatabase, users } = require("./db/db");

//Setting Up EJS
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());

app.use(
  cookieSession({
    name: "session",
    keys: [
      "8a6f534d-a7ac-4e85-a512-e1bc1b2bf01c",
      "12256e80-4f94-4d17-9d4e-57fd5ccb4d10"
    ],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);

// url database
// const urlDatabase = {
//   // username: req.cookies["username"],
//   b2xVn2: "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com",
//   abc3dd: "http://www.naver.com"
// };

// routers
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  let templateVars = { greeting: "Hello World!" };
  res.render("hello_world", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  const a = "Yo Chicken!!";
  res.send(`a = ${a}`);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// GET urls/new
app.get("/urls/new", (req, res) => {
  let userId = req.session["user_id"];

  if (!userId) {
    res.redirect("/login");
  }
  let templateVars = {
    user_info: users[userId],
    key: urlDatabase
  };
  res.render("urls_new", templateVars);
});

// GET login
app.get("/login", (req, res) => {
  res.render("login", users);
});

// POST login
app.post("/login", (req, res) => {
  let loginEmail = req.body.email;
  let loginPassword = req.body.password;
  if (req.body.email.length === 0 || req.body.password.length === 0) {
    res.status(403).json({ error: "Sorry, error" });
  } else if (checkEmailAndPasswordForLogin(loginEmail, loginPassword)) {
    let id = checkEmailAndPasswordFromUsers(req.body.email, req.body.password);
    // set cookie

    //cookie session
    req.session["user_id"] = id;

    // redirect to urls
    res.redirect("/urls");
  } else {
    res.status(403).json({ error: "Sorry, error" });
    res.redirect("/login");
  }
});

//logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// GET /register
app.get("/register", (req, res) => {
  res.render("register");
});

// POST /register
app.post("/register", (req, res) => {
  // add a new user object to the global users object
  const id = generateRandomString();

  if (req.body.email.length === 0 || req.body.password.length === 0) {
    res.status(400).json({ error: "Sorry, error" });
    res.redirect("/register");
  } else if (checkEmailFromUsers(req.body.email)) {
    res.status(400).json({ error: "Sorry, error" });
  } else {
    // apply for bcrypt
    const password = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      id: id,
      email: req.body.email,
      password: hashedPassword
    };
    users[id] = newUser;

    req.session["user_id"] = id;

    res.redirect("/urls");
  }
});

// POST -Create
app.post("/urls", (req, res) => {
  let userId = req.session["user_id"];
  if (!userId) {
    res.redirect("/login");
  }
  const newId = generateRandomString();
  urlDatabase[newId] = {
    longURL: req.body.longURL,
    userID: userId
  };

  res.redirect("/urls");
});

// POST -Delete
app.post("/urls/:shortURL/delete", (req, res) => {
  let userId = req.session["user_id"];

  if (!userId) {
    res.redirect("/login");
  }
  if (userId) {
    const deleteShortURL = req.params.shortURL;
    delete urlDatabase[req.params.shortURL];

    res.redirect("/urls");
  }
});

// POST - Edit
app.post("/urls/:shortURL", (req, res) => {
  let userId = req.session["user_id"];

  if (!userId) {
    res.redirect("/login");
  }

  const currentUserID = req.session["user_id"];
  urlDatabase[req.params.shortURL] = {
    longURL: req.body.longURL,
    userID: currentUserID
  };

  console.log("edit: req.body", urlDatabase);
  res.redirect("/urls");
});

// GET urls
app.get("/urls", (req, res) => {
  let userId = req.session["user_id"];

  if (!userId) {
    console.log("/urls: no user id", userId);
    res.redirect("/login");
  }
  const newDB = urlsForUser(userId);

  let templateVars = {
    user_info: users[userId],
    urlDB: newDB
  };
  res.render("urls_index", templateVars);
});

// GET - /urls/:shortURL
app.get("/urls/:shortURL", (req, res) => {
  let userId = req.session["user_id"];

  if (!userId) {
    console.log("/urls: no user id", userId);
    res.redirect("/login");
  }
  console.log("/urls/:shortURL req.params:", req.params);

  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
