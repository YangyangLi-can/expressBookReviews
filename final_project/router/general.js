const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
const BOOKS_API_URL = 'localhost:5000';

public_users.post("/register", (req,res) => {
  const {username, password } = req.body;
  if(!username || !password){
    return res.status(400).json({messaage:"Invalid request"});
  }
  if(users[username]){
    return res.status(409).json({ messaage:"Username already exists"});
  }
  users[username] = password;
  return res.status(201).json({messaage:"Successfully"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null,2));
});

// // Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(`${BOOKS_API_URL}/books`);
    return res.status(200).send(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  const book = Object.values(books).find(b => b.isbn === isbn);
  if(!book){
    return res.status(404).json({ message : "Not Found."});
  }
  return res.status(200).send(JSON.stringify(book, null, 2));
 });

//  // Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`${BOOKS_API_URL}/books/${isbn}`);
    return res.status(200).send(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Book not found." });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const authorBooks = Object.values(books).filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
  if(authorBooks.length === 0){
    return res.status(404).json({ messaage: "Not found"});
  }
  return res.status(200).send(JSON.stringify(authorBooks, null, 2));
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`${BOOKS_API_URL}/books?author=${author}`);
    return res.status(200).send(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "No books found for author." });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const titleBooks = Object.values(books).filter(b => b.title.toLowerCase().includes(title.toLowerCase()));
  if(titleBooks.length ===0){
    return res.status(404).json({ message: "Not found"});
  }
  return res.status(200).send(JSON.stringify(titleBooks,null,2));
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`${BOOKS_API_URL}/books?title=${title}`);
    return res.status(200).send(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "No books found for title." });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  const book = Object.values(books).find(b => b.isbn === isbn);
  if(!book){
    return res.status(404).json({ message: "Not found"});
  }
  return res.status(200).send(JSON.stringify(book.reviews || [], null,2));
});

// Get book review
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`${BOOKS_API_URL}/reviews/${isbn}`);
    return res.status(200).send(JSON.stringify(response.data || [], null, 2));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "No reviews found for book." });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports.general = public_users;
