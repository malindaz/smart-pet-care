const Appointment = require('../Models/Appointment');
const { validationResult } = require('express-validator');

// Generate available times between 9 AM and 5 PM in 30-minute slots
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  
  return slots;
};

// Helper to format times in 12-hour format
const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  
  return `${formattedHour}:${minutes} ${ampm}`;
};

// Get available appointment times
exports.getAvailableTimes = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Date parameter is required' 
      });
    }
    
    // Get all time slots
    const allTimeSlots = generateTimeSlots().map(time => formatTime(time));
    
    // Find existing appointments for the selected date
    const selectedDate = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const bookedAppointments = await Appointment.find({
      date: {
        $gte: selectedDate,
        $lte: endOfDay
      }
    });
    
    // Get times that are already booked
    const bookedTimes = bookedAppointments.map(appointment => appointment.time);
    
    // Filter out booked times
    const availableTimes = allTimeSlots.filter(time => !bookedTimes.includes(time));
    
    res.status(200).json({
      success: true,
      availableTimes
    });
  } catch (error) {
    console.error('Error getting available times:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching available times'
    });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    // Log the entire request body to see what's being received
    console.log("Request body:", req.body);
    
    // Check if the body is empty or undefined
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is empty'
      });
    }
    
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const {
      petName,
      petType,
      ownerName,
      email,
      phone,
      date,
      time,
      serviceType,
      notes
    } = req.body;

  
      console.log("Received data:", req.body);
      
      // Make sure the serviceType matches one of our enum values
      const validServiceTypes = [
        'Regular Checkup',
        'Vaccination',
        'Grooming',
        'Dental Care',
        'Specialized Treatment',
        'Emergency Care'
      ];
      
      if (!validServiceTypes.includes(serviceType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid service type. Must be one of: ${validServiceTypes.join(', ')}`
        });
      }
      
      // Make sure date is a valid Date object
      let appointmentDate;
      try {
        appointmentDate = new Date(date);
        if (isNaN(appointmentDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'Invalid date format'
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
      }
      
      // Check if there's already an appointment at this time
      const existingAppointment = await Appointment.findOne({
        date: {
          $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
        },
        time
      });
      
      if (existingAppointment) {
        return res.status(409).json({
          success: false,
          message: 'This time slot is no longer available. Please select another time.'
        });
      }
      
      // Create new appointment
      const appointment = new Appointment({
        petName,
        petType,
        ownerName,
        email,
        phone,
        date: appointmentDate,
        time,
        serviceType,
        notes: notes || ''  // Ensure notes is not undefined
      });
      
      await appointment.save();
      
      // Send success response
      res.status(201).json({
        success: true,
        message: 'Appointment scheduled successfully',
        data: appointment
      });
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({
        success: false,
        message: `Server error while scheduling appointment: ${error.message}`
      });
    }
};

// Get user's appointments - for authenticated users
exports.getUserAppointments = async (req, res) => {
  try {
    const { email } = req.query;
    
    console.log("Fetching appointments for email:", email);
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }
    
    // Find all appointments for this email (case insensitive)
    const appointments = await Appointment.find({ 
      email: { $regex: new RegExp('^' + email + '$', 'i') } 
    }).sort({ date: 1, time: 1 });
    
    console.log(`Found ${appointments.length} appointments for ${email}`);
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments'
    });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['scheduled', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
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
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findByIdAndDelete(id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting appointment'
    });
  }
};

// Fetch all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Accept an appointment
exports.acceptAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status: 'confirmed' },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment", error });
  }
};

// Reject an appointment
exports.rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment", error });
  }
};

// Add this to appointmentController.js
exports.updateAppointment = async (req, res) => {
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
};