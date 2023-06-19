const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = ["user1:password1", "user2:password2"];

const isValid = (username)=>{ //returns boolean
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // const user = `${username}:${password}`;
  // return users.includes(user);
  return true;
}

regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Invalid request body." });
  }
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username." });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Authentication failed. Invalid username or password." });
  }
  const token = jwt.sign({ username }, "secret_key");
  return res.status(200).json({ message: "Login successful.", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ message: "Invalid request body." });
  }
  const index = Object.values(books).findIndex(b => b.isbn === parseInt(req.params.isbn));
  if (index < 0) {
    return res.status(404).json({ message: "Book not found." });
  }
  if (!req.user) {
    return res.status(401).json({ message: "Authentication failed. Missing token." });
  }
  const { username } = req.user;
  const review = { username, rating, comment };
  if (!books[index].reviews) {
    books[index].reviews = [review];
  } else {
    books[index].reviews.push(review);
  }
  return res.status(200).json({ message: "Review added successfully.", book: books[index] });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
