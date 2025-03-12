// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  petName: {
    type: String,
    required: [true, 'Pet name is required']
  },
  petType: {
    type: String,
    required: [true, 'Pet type is required'],
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other']
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: [
      'Regular Checkup',
      'Vaccination',
      'Grooming',
      'Dental Care',
      'Specialized Treatment',
      'Emergency Care'
    ]
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index on date and time for faster lookups and ensuring uniqueness
appointmentSchema.index({ date: 1, time: 1 }, { unique: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;