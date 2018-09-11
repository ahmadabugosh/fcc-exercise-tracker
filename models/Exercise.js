const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const exercise = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  description: String,
  duration: Number,
  date: Date,
});

module.exports = mongoose.model("Exercise", exercise);
