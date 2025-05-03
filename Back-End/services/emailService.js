const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.user,
    pass: config.email.password
  }
});

// Format date for email
const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Email templates
const emailTemplates = {
  confirmation: (appointment) => ({
    subject: 'Pet Care Appointment Scheduled',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
        <h2 style="color: #4a6fa5;">Your Pet Care Appointment is Scheduled</h2>
        <p>Dear ${appointment.ownerName},</p>
        <p>Thank you for scheduling an appointment with our Pet Care Center. Your appointment details are:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Pet Name:</strong> ${appointment.petName}</p>
          <p><strong>Pet Type:</strong> ${appointment.petType}</p>
          <p><strong>Service:</strong> ${appointment.serviceType}</p>
          <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
          <p><strong>Time:</strong> ${appointment.time}</p>
          <p><strong>Status:</strong> Scheduled (Pending Confirmation)</p>
        </div>
        <p>Our veterinary team will review your appointment request shortly and send you a confirmation.</p>
        <p>If you need to make any changes to your appointment, please contact us at support@petcare.com or call (123) 456-7890.</p>
        <p>Thank you for choosing our services!</p>
        <p>Best regards,<br>Pet Care Center Team</p>
      </div>
    `
  }),
  
  acceptance: (appointment) => ({
    subject: 'Pet Care Appointment Confirmed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
        <h2 style="color: #4caf50;">Your Pet Care Appointment is Confirmed</h2>
        <p>Dear ${appointment.ownerName},</p>
        <p>We are pleased to confirm your upcoming appointment with our Pet Care Center. Your appointment details are:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Pet Name:</strong> ${appointment.petName}</p>
          <p><strong>Pet Type:</strong> ${appointment.petType}</p>
          <p><strong>Service:</strong> ${appointment.serviceType}</p>
          <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
          <p><strong>Time:</strong> ${appointment.time}</p>
          <p><strong>Status:</strong> Confirmed</p>
        </div>
        <p>Please arrive 10 minutes before your scheduled appointment time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        <p>If you have any questions, please contact us at support@petcare.com or call (123) 456-7890.</p>
        <p>We look forward to seeing you and your pet!</p>
        <p>Best regards,<br>Pet Care Center Team</p>
      </div>
    `
  }),
  
  rejection: (appointment) => ({
    subject: 'Pet Care Appointment Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
        <h2 style="color: #f44336;">Pet Care Appointment Update</h2>
        <p>Dear ${appointment.ownerName},</p>
        <p>We regret to inform you that we are unable to accommodate your appointment request at the scheduled time:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Pet Name:</strong> ${appointment.petName}</p>
          <p><strong>Pet Type:</strong> ${appointment.petType}</p>
          <p><strong>Service:</strong> ${appointment.serviceType}</p>
          <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
          <p><strong>Time:</strong> ${appointment.time}</p>
          <p><strong>Status:</strong> Cancelled</p>
        </div>
        <p>This is often due to scheduling conflicts or unavailability of our specialists. We sincerely apologize for any inconvenience this may cause.</p>
        <p>Please contact us to reschedule your appointment at a more convenient time for both parties. You can reach us at support@petcare.com or call (123) 456-7890.</p>
        <p>Thank you for your understanding.</p>
        <p>Best regards,<br>Pet Care Center Team</p>
      </div>
    `
  })
};

// Send appointment confirmation email
exports.sendAppointmentConfirmation = async (appointment) => {
  try {
    const { subject, html } = emailTemplates.confirmation(appointment);
    
    await transporter.sendMail({
      from: `"Pet Care Center" <${config.email.user}>`,
      to: appointment.email,
      subject,
      html
    });
    
    console.log(`Confirmation email sent to ${appointment.email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error };
  }
};

// Send appointment acceptance email
exports.sendAppointmentAcceptance = async (appointment) => {
  try {
    const { subject, html } = emailTemplates.acceptance(appointment);
    
    await transporter.sendMail({
      from: `"Pet Care Center" <${config.email.user}>`,
      to: appointment.email,
      subject,
      html
    });
    
    console.log(`Acceptance email sent to ${appointment.email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending acceptance email:', error);
    return { success: false, error };
  }
};

// Send appointment rejection email
exports.sendAppointmentRejection = async (appointment) => {
  try {
    const { subject, html } = emailTemplates.rejection(appointment);
    
    await transporter.sendMail({
      from: `"Pet Care Center" <${config.email.user}>`,
      to: appointment.email,
      subject,
      html
    });
    
    console.log(`Rejection email sent to ${appointment.email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending rejection email:', error);
    return { success: false, error };
  }
};