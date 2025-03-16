const mongoose = require('mongoose');

const petRecordSchema = new mongoose.Schema({
  petId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  petName: {
    type: String,
    required: true,
    trim: true
  },
  species: {
    type: String,
    required: true,
    trim: true
  },
  breed: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'unknown']
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  vaccinationStatus: {
    type: String,
    required: true,
    enum: ['up-to-date', 'partially-vaccinated', 'not-vaccinated', 'unknown']
  },
  symptoms: {
    type: String,
    required: true
  },
  symptomsDuration: {
    type: String,
    trim: true
  },
  lastCheckup: {
    type: Date,
    required: true
  },
  historicalRecords: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field before saving
petRecordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('addrecords', petRecordSchema);