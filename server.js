const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");
//const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

//Mongoose Config
const db = mongoose.connection;
mongoURI = process.env.MONGODB_URI || "mongodb://192.168.0.160:27017/redo";

mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
  console.log("Connection with MongoDB is established");
});

//Check error
db.on("error", (err) => {
  console.log("Error while connecting to DB" + err.message);
});

db.on("disconnected", () => {
  console.log("MongoDB Disconnected");
});

const userController = require("./controllers/users.js");
const sessionController = require("./controllers/sessions.js");
const expenseController = require("./controllers/expenseController");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

//-----------------------------------------------------------------

//To get session
app.use(
  session({
    secret: "somerandomstringvalue",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/users", userController);
app.use("/sessions", sessionController);
// app.use("/expense", expenseController);

//Login page
app.get("/login", (req, res) => {
  res.render("view.ejs", { userDetails: req.session.currentUser });
});

//New User page
app.get("/users/new", (req, res) => {
  res.render("/users/new");
});

// Add Budget Page
app.get("/budget", (req, res) => {
  // if (userDetails = req.session.currentUser) {
  //res.send("Im in add page");
  // Budget.findOne((err, budgetDB) => {
  //   if (budgetDB) {
  res.render("../views/expense/add_budget");
  // } else {
  //   res.redirect("/");
  // }
  // });
});

// Add Expense Page
app.get("/expense", (req, res) => {
  // if (userDetails = req.session.currentUser) {
  //res.send("Im in add page");
  res.render("../views/expense/add_expense");
  // } else {
  //   res.redirect("/");
});

// Expense Summary Page
app.get("/summary", (req, res) => {
  Expense.find((err, dataExpenses) => {
    Budget.findOne((err, dataBudget) => {
      console.log(dataExpenses);
      console.log(dataBudget);

      // if (userDetails = req.session.currentUser) {
      //res.send("Im in summary page");
      res.render("../views/summary/new.ejs", {
        summary: dataExpenses,
        budget: dataBudget,
      });
      // } else {
      //   res.redirect("/add");
    });
  });
});

const Expense = require("./models/expenseSchema");
const Budget = require("./models/budgetSchema");

// Create : POST   '/summary'
app.post("/budget/add", (req, res) => {
  console.log(req.body.budget);
  Budget.create(req.body, (err, budget) => {
    if (err) {
      res.send(err);
    } else {
      console.log("Success insert budget");
      res.redirect("/expense");
    }
  });
});

app.get("/budget/update", (req, res) => {
  Budget.findOne((err, budgetDB) => {
    if (budgetDB) {
      res.render("../views/expense/update_budget.ejs", { budget: budgetDB });
    } else {
      res.send("No budget. Please add budget first.");
    }
  });
});

// UPDATE Budget
// app.get("/budget/update/:id", (req, res) => {
//   Budget.findById(req.params.id, (err, budgetById) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("../views/expense/update_budget.ejs", {
//         budget: budgetById,
//       });
//     }
//   });
// });

app.put("/budget/update/:id", (req, res) => {
  Budget.findByIdAndUpdate(req.params.id, req.body, (err, budget) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/summary");
  });
});

//-----------------------------------------------------------------

app.post("/expense/add", (req, res) => {
  console.log(req.body);
  console.log(req.body.date);
  let date = req.body.date.split("-");
  console.log(date);
  Expense.create(req.body, (err, expense) => {
    if (err) {
      res.send(err);
    } else {
      console.log("Success insert expense");
      res.redirect("/expense");
    }
  });
});

// UPDATE
app.get("/summary/update/:id", (req, res) => {
  Expense.findById(req.params.id, (err, expenseById) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(expenseById);
      res.render("../views/summary/update_expense.ejs", {
        expense: expenseById,
      });
      // res.redirect("/summary");
    }
  });
});

app.put("/summary/update/:id", (req, res) => {
  Expense.findByIdAndUpdate(req.params.id, req.body, (err, summary) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/summary");
  });
});

app.delete("/summary/delete/:id", (req, res) => {
  Expense.findByIdAndRemove(req.params.id, (err, summary) => {
    if (err) {
      console.log(err);
    } else {
      // console.log("Delete successful");
      res.redirect("/summary");
    }
  });
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

//-----------------------------------------------------------------

app.listen(port, () => {
  console.log("Authentication app is running on port: " + port);
});
