const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const user = new Schema({
  username: { type: String, unique: true }
});

module.exports = mongoose.model("User", user);