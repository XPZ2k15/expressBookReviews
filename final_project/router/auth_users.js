const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
console.log(users);
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
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
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  console.log(req.session.authorization.username)
  let isbn = req.query.isbn;
  let stars = req.query.stars;
  let desc = req.query.desc;

  const filtered_books = Object.values(books).filter(x=>x.isbn === isbn);
  if(filtered_books.length < 1){
    return res.status(200).json({message: `There are no books matching the ISBN: ${isbn}`})
  } else {
    
    let book = Object.values(books).findIndex(x => x.isbn === isbn)
    
    let reviewe = books[book + 1].reviews.filter(obj => obj.user === req.session.authorization.username)



    let review = {
      "user": `${req.session.authorization.username}`,
      "stars": stars,
      "desc": desc
    }


    if (reviewe.length > 0) {
      console.log('he exists already')
      let reviewer = Object.values(books[book + 1].reviews).findIndex(obj => obj.user === req.session.authorization.username)

      console.log(reviewer)

      books[book + 1].reviews[reviewer] = review
      
      console.log( books[book + 1].reviews[reviewer])
    } else {
      books[book+1].reviews.push(review)
    }

    return res.status(200).send(`Here are the reviews for ISBN: ${isbn} \n ${JSON.stringify(filtered_books[0].reviews)}`)
  }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  console.log(req.session.authorization.username)
  let isbn = req.query.isbn;
  let stars = req.query.stars;
  let desc = req.query.desc;

  const filtered_books = Object.values(books).filter(x=>x.isbn === isbn);
  if(filtered_books.length < 1){
    return res.status(200).json({message: `There are no books matching the ISBN: ${isbn}`})
  } else {
    
    let book = Object.values(books).findIndex(x => x.isbn === isbn)
    
    let reviewe = books[book + 1].reviews.filter(obj => obj.user === req.session.authorization.username)





    if (reviewe.length > 0) {
      console.log('he exists already')
      let reviewer = Object.values(books[book + 1].reviews).findIndex(obj => obj.user === req.session.authorization.username)

      console.log(reviewer)

      books[book + 1].reviews.splice(reviewer, 1);
      return res.status(200).send(`You have deleted the review from ISBN: ${isbn} \n Deleted the review from user: ${req.session.authorization.username}  \n Here are the remaining reviews: ${JSON.stringify(filtered_books[0].reviews)}`)

     // console.log( books[book + 1].reviews[reviewer])
    } else {
      return res.status(200).send(`There is no review by the user ${req.session.authorization.username}`)

    }

  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
