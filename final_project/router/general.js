const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  const getBooks = await books;
  //Write your code here
  return res.status(200).json({getBooks})
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const filtered_books = await Object.values(books).filter(x=>x.isbn === isbn);
  if(filtered_books.length < 1){
    return res.status(200).json({message: `There are no books matching the ISBN: ${isbn}`})
  } else {
    return res.status(200).send(filtered_books)
  }

});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;
  const filtered_books = await Object.values(books).filter(x=>x.author === author);
  if(filtered_books.length < 1){
    return res.status(200).json({message: `There are no books matching the author: ${author}`})
  } else {
    return res.status(200).send(filtered_books)
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title;
  const filtered_books = await Object.values(books).filter(x=>x.title === title);
  if(filtered_books.length < 1){
    return res.status(200).json({message: `There are no books matching the title: ${title}`})
  } else {
    return res.status(200).send(filtered_books)
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const filtered_books = Object.values(books).filter(x=>x.isbn === isbn);
  if(filtered_books.length < 1){
    return res.status(200).json({message: `There are no books matching the ISBN: ${isbn}`})
  } else {
    return res.status(200).send(`Here are the reviews for ISBN: ${isbn} \n ${JSON.stringify(filtered_books[0].reviews)}`)
  }
});


const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }


module.exports.general = public_users;
