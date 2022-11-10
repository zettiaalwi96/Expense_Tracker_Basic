const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
  budget: { type: Number, required: true },
});

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
