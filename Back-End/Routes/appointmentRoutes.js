const express = require('express');
const router = express.Router();
const { 
  createAppointment, 
  getUserAppointments, 
  getAvailableTimes,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  acceptAppointment,
  rejectAppointment,
  updateAppointment,
  completeAppointment
} = require('../Controllers/appointmentController');
const Appointment = require('../Models/Appointment');
const { protect } = require('../Middleware/authMiddleware');

// Public routes
router.get('/available-times', getAvailableTimes);
router.post('/', createAppointment);

// User-specific routes
router.get('/user', getUserAppointments);

// Update appointment
router.patch('/:id',  async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, notes } = req.body;
    
    // Validate required fields
    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Date and time are required fields'
      });
    }
    
    // Find and update the appointment
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { date, time, notes },
      { new: true, runValidators: true }
    );
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating appointment'
    });
  }
});

// Get all appointments
router.get('/all', getAllAppointments);

// Get appointment by ID
router.get('/:id', getAppointmentById);


// Update the status of appointment
router.patch('/:id/status', updateAppointmentStatus);

router.patch('/:id', updateAppointment);


router.delete('/:id',  deleteAppointment);

// Accept appointment
router.put('/:id/accept', acceptAppointment);

// Reject appointment
router.put('/:id/reject', rejectAppointment);

// Complete appointment
router.put('/:id/complete', completeAppointment);

module.exports = router;