const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });

    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // check if user is registered
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // if user is registered log user in
        // Store access token and username in session
        req.session.authorization = {
            username,
            accessToken,
        };
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    } 

});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.body.review;
    const isbn = req.params.isbn;
    const username = req.user.username;

    
    if (!review) {
        return res.status(400).json({ message: "Review content is required." });
    }
    
    const book = books[isbn];
    if (!book) {
    return res.status(404).json({ message: "Book not found." });
    }

    // Ensure the reviews object exists
    if (!book.reviews) {
        book.reviews = {};
    }

    const isUpdate = book.reviews.hasOwnProperty(username);

      // Add or update review for the user
    book.reviews[username] = review;

    return res.status(isUpdate ? 200 : 201).json({
        message: isUpdate ? "Review updated successfully." : "Review added successfully.",
        isbn,
        user: username,
        review: book.reviews[username]
    });
});


// DELETE review by logged-in user
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
  
    if (!username) {
      return res.status(401).json({ message: "You must be logged in to delete a review." });
    }
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    if (!book.reviews[username]) {
      return res.status(404).json({ message: "No review by this user to delete." });
    }
  
    delete book.reviews[username];
  
    return res.status(200).json({
      message: "Your review has been deleted.",
      reviews: book.reviews
    });
});

  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;