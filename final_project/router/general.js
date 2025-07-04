const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase();
    const booksByAuthor = [];

    for(let isbn in books) {
        if(books[isbn].author.toLowerCase() === author) {
            booksByAuthor.push({isbn, ...books[isbn]})
        }
    }

    if (booksByAuthor.length === 0) {
        return res.status(404).json({message: "No books found by this author"})
    }
    return res.send(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  const booksByTitle = [];

  for (let isbn in books) {
    if (books[isbn].title.toLowerCase() === title) {
        booksByTitle.push({isbn, ...books[isbn]})
    }
  }

  if (booksByTitle.length === 0) {
    return res.status(404).json({message: "No books found by this title"})
  }

  return res.send(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
