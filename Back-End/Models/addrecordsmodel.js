const mongoose = require('mongoose');

// Counter schema for auto-incrementing petId
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const petRecordSchema = new mongoose.Schema({
  petId: {
    type: String,
    required: true,
    unique: true,
    trim: true
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

// Middleware to auto generate petId before saving
petRecordSchema.pre('validate', async function (next) {
  if (!this.petId) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'petId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      this.petId = `P${counter.seq.toString().padStart(4, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Middleware to update 'updatedAt' field before saving
petRecordSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const PetRecord = mongoose.model('PetRecord', petRecordSchema);

module.exports = PetRecord;


