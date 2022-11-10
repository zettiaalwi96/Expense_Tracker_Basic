const express = require("express");
const router = express.Router();

const Expense = require("../models/expenseSchema");
const Budget = require("../models/budgetSchema");

// 7 Restful Routes
// Index  : GET    '/summary'          1/7
// Show   : GET    '/summary/:id'      2/7
// New    : GET    '/summary/new'      3/7
// Create : POST   '/summary'          4/7
// Edit   : GET    '/summary/:id/edit' 5/7
// Update : PUT    '/summary/:id'      6/7
// Delete : DELETE '/summary/:id'      7/7

// Index  : GET    '/summary'
router.get("/", (req, res) => {
  Expense.find({}, (err, summary) => {
    if (req.session.currentUser) {
      res.render("../views/summary.ejs", { summary });
    } else {
      res.redirect("/login");
    }
  });
});

// New    : GET    '/summary/new'
router.get("/new", (req, res) => {
  if (req.session.currentUser) {
    res.render("../views/expense/add_expense.ejs");
  } else {
    res.redirect("/login");
  }
});

// // Show   : GET    '/summary/:id'
// router.get("/:id", (req, res) => {
//   Expense.findById(req.params.id, (err, summary) => {
//     if (req.session.currentUser) {
//       res.render("../views/show.ejs", { summary: summary });
//     } else {
//       res.redirect("/login");
//     }
//   });
// });

// Create : POST   '/summary'
router.post("/", (req, res) => {
    console.log(req.body);
    
  Budget.create(req.body, (err, budget) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/summary");
    }
  });
  Expense.create(req.body, (err, expense) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/summary");
    }
  });
});

// Edit   : GET    '/summary/:id/edit'
router.get("/:id/edit", (req, res) => {
  Expense.findById(req.params.id, (err, summary) => {
    if (req.session.currentUser) {
      res.render("../views/summary/update_expense.ejs");
    } else {
      res.redirect("/summary");
    }
  });
});

// Update : PUT    '/summary/:id'
router.put("/:id", (req, res) => {
  Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, summary) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/summary/" + summary.id);
    }
  );
});

// Delete : DELETE '/summary/:id'
router.delete("/:id", (req, res) => {
  Expense.findByIdAndRemove(req.params.id, (err, summary) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/summary");
  });
});

module.exports = router;
