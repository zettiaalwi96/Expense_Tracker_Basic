// Mongoose is used to comunicate with the database because express.js cannot

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

//To not allow duplicate of username
userSchema.index({username:1}, {unique: true})

const User = mongoose.model("User", userSchema);

module.exports = User;