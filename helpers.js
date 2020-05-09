const { urlDatabase, users } = require("./db/db");
const bcrypt = require("bcrypt");
// helper functions
const getUserByEmail = function(email, database) {
  for (let user in database) {
    if (database[user].email === email) {
      return user;
    }
  }
  return false;
};

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
      bcrypt.compareSync(formPassword, users[eachUser].password)
    ) {
      return true;
    }
  }

  return false;
};

const urlsForUser = id => {
  const newDB = { ...urlDatabase };

  for (let data in newDB) {
    if (newDB[data].userID === id) {
      newDB[data] = {
        longURL: newDB[data].longURL,
        userID: newDB[data].userID
      };
    } else {
      delete newDB[data];
    }
  }
  console.log("urlsForUser: ", newDB);
  return newDB;
};

const checkEmailAndPasswordFromUsers = (formEmail, formPassword) => {
  console.log("checkEmailAndPasswordFromUsers: ", formEmail, formPassword);
  for (let eachUser in users) {
    if (
      users[eachUser].email === formEmail &&
      bcrypt.compareSync(formPassword, users[eachUser].password)
    ) {
      console.log("matched");
      return users[eachUser].id;
    }
  }
  return false;
};

module.exports = {
  generateRandomString,
  checkEmailFromUsers,
  checkEmailAndPasswordForLogin,
  urlsForUser,
  checkEmailAndPasswordFromUsers,
  getUserByEmail
};
