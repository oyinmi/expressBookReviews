const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Helper function to check if a username already exists
function doesExist(username) {
  return users.some(user => user.username === username);
}

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    // Check if the user already exists
    if (doesExist(username)) {
      return res.status(409).json({ message: "User already exists!" });
    }
  
    // Add the new user
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered. Now you can login." });
});
  

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try {
    const result = await res.send(JSON.stringify(books, null, 4));
    return result
  } catch (error) {
    console.error(error.message)
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    // return res.send(books[isbn]);

    new Promise((resolve, reject) => {
        const book = books[isbn];

        if (book) {
            resolve(book);
        } else {
            reject ("Book not found");
        }
    })
    .then ((book) => {
        res.status(200).send(book)
    })
    .catch ((error) => {
        res.status(404).send(error.message)
    })
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
  
    new Promise((resolve, reject) => {
      const booksByAuthor = [];
  
      for (let isbn in books) {
        if (books[isbn].author.toLowerCase() === author) {
          booksByAuthor.push({ isbn, ...books[isbn] });
        }
      }
  
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(new Error("No books found by this author"));
      }
    })
      .then((booksByAuthor) => {
        res.status(200).json(booksByAuthor);
      })
      .catch((error) => {
        res.status(404).json({ message: error.message });
      });
});
  
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    console.log(title)
  
    new Promise((resolve, reject) => {
      const booksByTitle = [];
  
      for (let isbn in books) {
        if (books[isbn].title.toLowerCase() === title) {
          booksByTitle.push({ isbn, ...books[isbn] });
        }
      }
  
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject(new Error("No books found by this title"));
      }
    })
      .then((booksByTitle) => {
        res.status(200).json(booksByTitle);
      })
      .catch((error) => {
        res.status(404).json({ message: error.message });
      });
});
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

   // Check if the ISBN exists
   if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  // Assuming books[isbn].reviews is an object or array of reviews
  const review = books[isbn].reviews;
    return res.send(review)
});

module.exports.general = public_users;
