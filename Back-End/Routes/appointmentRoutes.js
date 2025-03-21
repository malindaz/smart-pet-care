// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createAppointment, 
  getUserAppointments, 
  getAvailableTimes, 
  updateAppointmentStatus,
  deleteAppointment,
  getAllAppointments,
  acceptAppointment,
  rejectAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/available-times', getAvailableTimes);
router.post('/', createAppointment);

// User-specific routes
router.get('/user', getUserAppointments);

// Update appointment
router.patch('/:id', protect, async (req, res) => {
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

// Update appointment status
router.patch('/:id/status', updateAppointmentStatus);

// Admin routes
router.get('/', protect, getAllAppointments);
router.patch('/:id/accept', protect, acceptAppointment);
router.patch('/:id/reject', protect, rejectAppointment);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;