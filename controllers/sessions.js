const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const User = require("../models/userSchema.js");

router.get("/", (req, res) => {
  res.render("view.ejs");
});

router.post("/", (req, res) => {
  User.findOne({ username: req.body.username }, (error, foundUserDetails) => {
    if (error) {
      console.log("Unable to retrieve user " + error.message);
    } else {
      //if (foundUserDetails && req.body.password === foundUserDetails.password) { //ITS NOT LOADING
      if (foundUserDetails) {
        if (bcrypt.compareSync(req.body.password, foundUserDetails.password)) {
          //res.send("Logged in");
          req.session.currentUser = foundUserDetails;
          res.redirect("/budget");
        }
      } else {
        res.send("Invalid User ID or Password");
      }
    }
  });
});

// //I dont understand this part
router.delete("/", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
