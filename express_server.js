const express = require("express");
const app = express();
const PORT = 8000; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
//Setting Up EJS
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// url database
// const urlDatabase = {
//   // username: req.cookies["username"],
//   b2xVn2: "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com",
//   abc3dd: "http://www.naver.com"
// };

// new url database
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

// user database
const users = {
  wfyw52: {
    id: "wfyw52",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  jowwxo: {
    id: "jowwxo",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// helper functions
const generateRandomString = () => {
  const id = Math.random()
    .toString(36)
    .substr(2, 6);
  return id;
};

const checkEmailFromUsers = formEmail => {
  for (let eachUser in users) {
    if (users[eachUser].email === formEmail) {
      return true;
    }
  }
  return false;
};

const checkEmailAndPasswordForLogin = (formEmail, formPassword) => {
  console.log("checkEmailAndPasswordForLogin: ", formEmail, formPassword);
  for (let eachUser in users) {
    console.log(
      "inside for: ",
      users[eachUser].email,
      users[eachUser].password
    );
    if (
      users[eachUser].email === formEmail &&
      users[eachUser].password === formPassword
    ) {
      return true;
    }
  }

  return false;
};

const checkEmailAndPasswordFromUsers = (formEmail, formPassword) => {
  console.log("checkEmailAndPasswordFromUsers: ", formEmail, formPassword);
  for (let eachUser in users) {
    if (
      users[eachUser].email === formEmail &&
      users[eachUser].password === formPassword
    ) {
      console.log("matched");
      return users[eachUser].id;
    }
  }
  return false;
};

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
  console.log("/u/:shortURL req.params.shortURL:", req.params.shortURL);
  // const longURL = urlDatabase[req.params.shortURL];
  const longURL = urlDatabase[req.params.shortURL].longURL;
  console.log("/u/:shortURL longURL:", longURL);
  res.redirect(longURL);
});

// GET urls/new
app.get("/urls/new", (req, res) => {
  let userId = req.cookies["user_id"];
  if (!userId) {
    console.log("/urls/new: no user id", userId);
    res.redirect("/login");
  }
  let templateVars = {
    // user_id: req.cookies["user_id"],
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
  console.log("login: ", loginEmail, loginPassword);
  if (req.body.email.length === 0 || req.body.password.length === 0) {
    // res.redirect("/login");
    res.status(403).json({ error: "Sorry, error" });
  } else if (checkEmailAndPasswordForLogin(loginEmail, loginPassword)) {
    let id = checkEmailAndPasswordFromUsers(req.body.email, req.body.password);
    // set cookie
    console.log("user_id", id);
    // res.clearCookie("user_id");
    res.cookie("user_id", id);
    // redirect to urls
    res.redirect("/urls");
  } else {
    res.status(403).json({ error: "Sorry, error" });
    res.redirect("/login");
  }
});

//logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
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
    const newUser = {
      id: id,
      email: req.body.email,
      password: req.body.password
    };
    users[id] = newUser;
    console.log("/register user: ", users);
    // set cookie
    res.cookie("user_id", id);
    // redirect to urls
    res.redirect("/urls");
  }
});

// POST -Create
app.post("/urls", (req, res) => {
  console.log(req.body.longURL); // Log the POST request body to the console
  const newId = generateRandomString();
  urlDatabase[newId] = req.body.longURL;
  res.redirect("/urls");

  // res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

// POST -Delete
app.post("/urls/:shortURL/delete", (req, res) => {
  console.log("delete: req.param", req.params.shortURL);
  const deleteShortURL = req.params.shortURL;
  delete urlDatabase[req.params.shortURL];
  console.log("delete:", urlDatabase["req.params.shortURL"]);
  res.redirect("/urls");
});

// POST - Edit
app.post("/urls/:shortURL", (req, res) => {
  console.log("edit: req.cookies", req.cookies["user_id"]);
  console.log("edit: req.param", req.params.shortURL);
  console.log("edit: req.body", req.body);
  const currentUserID = req.cookies["user_id"];
  urlDatabase[req.params.shortURL] = {
    longURL: req.body.longURL,
    userID: currentUserID
  };

  // urlDatabase[req.params.shortURL] = req.body.longURL;
  console.log("edit: req.body", urlDatabase);
  res.redirect("/urls");
});

// GET urls
app.get("/urls", (req, res) => {
  console.log("/urls: req.cookies", req.cookies["user_id"]);
  let userId = req.cookies["user_id"];
  let templateVars = {
    // user_id: req.cookies["user_id"],
    user_info: users[userId],
    urlDB: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// const urlDatabase = {
//   b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
//   i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
// };

// GET - /urls/:shortURL
app.get("/urls/:shortURL", (req, res) => {
  console.log("/urls/:shortURL req.params:", req.params);
  // let templateVars = { shortURL: req.params.shortURL, longURL: /* What goes here? */ };
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
