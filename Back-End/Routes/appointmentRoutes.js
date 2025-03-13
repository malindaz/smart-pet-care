// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const appointmentController = require('../controllers/appointmentController');

// Get available appointment times
router.get(
  '/available-times',
  appointmentController.getAvailableTimes
);

// Create new appointment
router.post(
  '/',
  [
    check('petName', 'Pet name is required').notEmpty(),
    check('petType', 'Valid pet type is required').notEmpty(),
    check('ownerName', 'Owner name is required').notEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('phone', 'Phone number is required').notEmpty(),
    // Fix the date validation - accept string format
    check('date', 'Date is required').notEmpty(),
    check('time', 'Time is required').notEmpty(),
    check('serviceType', 'Service type is required').notEmpty()
  ],
  appointmentController.createAppointment
);

// Get user's appointments (would normally be protected by authentication)
router.get(
  '/user',
  appointmentController.getUserAppointments
);

// Update appointment status (would normally be protected by authentication)
router.patch(
  '/:id',
  appointmentController.updateAppointmentStatus
);

module.exports = router;