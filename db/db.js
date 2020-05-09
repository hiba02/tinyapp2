// new url database
const bcrypt = require("bcrypt");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "wfyw52" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "wfyw52" },
  a2cozr: { longURL: "https://www.yahoo.com", userID: "jowwxo" },
  c3recz: { longURL: "https://www.naver.com", userID: "jowwxo" }
};

// user database
const users = {
  wfyw52: {
    id: "wfyw52",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  jowwxo: {
    id: "jowwxo",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};
module.exports = { urlDatabase, users };
