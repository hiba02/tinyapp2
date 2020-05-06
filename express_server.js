const express = require("express");
const app = express();
const PORT = 8000; // default port 8080
const bodyParser = require("body-parser");
//Setting Up EJS
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  abc3dd: "http://www.naver.com"
};

const generateRandomString = () => {
  const id = Math.random()
    .toString(36)
    .substr(2, 6);
  return id;
};

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
  const longURL = urlDatabase[req.params.shortURL];
  console.log("/u/:shortURL longURL:", longURL);
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Create
app.post("/urls", (req, res) => {
  console.log(req.body.longURL); // Log the POST request body to the console
  const newId = generateRandomString();
  urlDatabase[newId] = req.body.longURL;
  res.redirect("/urls");

  // res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

// Delete
app.post("/urls/:shortURL/delete", (req, res) => {
  console.log("delete: req.param", req.params.shortURL);
  const deleteShortURL = req.params.shortURL;
  delete urlDatabase[req.params.shortURL];
  console.log(urlDatabase["req.params.shortURL"]);
  res.redirect("/urls");
});

// Edit
app.post("/urls/:shortURL", (req, res) => {
  console.log("edit: req.param", req.params.shortURL);
  console.log("edit: req.body", req.body);
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let templateVars = { key: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  console.log("/urls/:shortURL req.params:", req.params);
  // let templateVars = { shortURL: req.params.shortURL, longURL: /* What goes here? */ };
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
