
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: String,
  age: Number,
  weight: Number,
  gender: { type: String, required: true },
  microchipID: String,
  lastCheckup: Date,
  ownerName: { type: String, required: true }
});

module.exports = mongoose.model('Pet', petSchema);