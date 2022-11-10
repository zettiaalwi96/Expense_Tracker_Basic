const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const User = require("../models/userSchema.js");

router.get("/new", (req, res) => {
  res.render("users/new.ejs");
});

router.post("/", (req, res) => {
  // let password = req.body.password;
  // let rePassword = req.body.rePassword;
  if (req.body.password === req.body.rePassword) {
    User.create();
  }
  // } else {
  //   return ({ message: 'Password doesnt match.' });
  // }

  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );

  User.create(req.body, (error, createdUser) => {
    if (error) {
      res.send("Username already existed. Please try again.");
      console.log("Unable to create user");
    } else {
      //res.send(createdUser); //It will display as a javascript object
      res.redirect("/login"); 
    }
  });
});

module.exports = router;
