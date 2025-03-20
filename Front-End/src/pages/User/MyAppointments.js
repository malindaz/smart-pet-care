import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/User/myappointments.css';
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editAppointment, setEditAppointment] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  // Get user email from localStorage with better error handling
  const getUserEmail = () => {
    // Check all possible variations of the email key
    const possibleKeys = ['email', 'Email', 'userEmail', 'user_email', 'usermail'];
    
    for (const key of possibleKeys) {
      const value = localStorage.getItem(key);
      if (value && value.trim() !== '') {
        console.log(`Found email in localStorage with key: ${key}`);
        return value;
      }
    }
    
    // Log all localStorage keys for debugging
    console.log('All localStorage keys:', Object.keys(localStorage));
    return null;
  };

  const userEmail = getUserEmail();

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format date for input field
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Fetch user appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log("Fetching appointments for:", userEmail);
      
      const response = await axios.get(`http://localhost:5000/api/appointments/user?email=${encodeURIComponent(userEmail)}`);
      console.log("API response:", response.data);
      
      if (response.data.success) {
        // Sort appointments by date and time
        const sortedAppointments = response.data.data.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB;
          }
          
          // If dates are equal, sort by time
          const timeA = a.time.replace(/[^0-9:]/g, '');
          const timeB = b.time.replace(/[^0-9:]/g, '');
          return timeA.localeCompare(timeB);
        });
        
        setAppointments(sortedAppointments);
      } else {
        setError('Failed to fetch appointments');
      }
    } catch (err) {
      console.error("Error details:", err);
      setError(`Error fetching appointments: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available times for a specific date
  const fetchAvailableTimes = async (date) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/appointments/available-times?date=${date}`);
      
      if (response.data.success) {
        setAvailableTimes(response.data.availableTimes);
      } else {
        setError('Failed to fetch available times');
      }
    } catch (err) {
      setError(`Error fetching available times: ${err.message}`);
    }
  };

  // Handle edit button click
  const handleEdit = (appointment) => {
    setEditAppointment({
      ...appointment,
      date: formatDateForInput(appointment.date)
    });
    fetchAvailableTimes(formatDateForInput(appointment.date));
  };

  // Handle date change during edit
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setEditAppointment({
      ...editAppointment,
      date: newDate,
      time: '' // Reset time when date changes
    });
    fetchAvailableTimes(newDate);
  };

  // Handle cancel appointment
  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const response = await axios.patch(`http://localhost:5000/api/appointments/${id}/status`, {
          status: 'cancelled'
        });
        
        if (response.data.success) {
          setCancelSuccess(true);
          setTimeout(() => setCancelSuccess(false), 3000);
          fetchAppointments();
        }
      } catch (err) {
        setError(`Error cancelling appointment: ${err.message}`);
      }
    }
  };

  // Handle save updated appointment
  const handleSave = async () => {
    try {
      // First check if the time slot is available
      const newDate = new Date(editAppointment.date);
      const isSameDateTime = appointments.some(app => 
        app._id !== editAppointment._id && 
        formatDateForInput(app.date) === editAppointment.date && 
        app.time === editAppointment.time
      );
      
      if (isSameDateTime) {
        setError('This time slot is already booked. Please select another time.');
        return;
      }
      
      // Update the appointment
      const response = await axios.patch(`http://localhost:5000/api/appointments/${editAppointment._id}`, {
        date: editAppointment.date,
        time: editAppointment.time,
        notes: editAppointment.notes
      });
      
      if (response.data.success) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
        setEditAppointment(null);
        fetchAppointments();
      }
    } catch (err) {
      setError(`Error updating appointment: ${err.message}`);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditAppointment(null);
    setError(null);
  };

  useEffect(() => {
    if (userEmail) {
      fetchAppointments();
    } else {
      setError('User not logged in');
      setLoading(false);
    }
  }, [userEmail]);

  // Get appointment status class
  const getStatusClass = (status) => {
    switch(status) {
      case 'scheduled': return 'view-myappointments-status-scheduled';
      case 'confirmed': return 'view-myappointments-status-confirmed';
      case 'completed': return 'view-myappointments-status-completed';
      case 'cancelled': return 'view-myappointments-status-cancelled';
      default: return '';
    }
  };

  // Check if appointment is in the past
  const isAppointmentPast = (date) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    return appointmentDate < today;
  };

  // Group appointments by date
  const groupAppointmentsByDate = () => {
    const grouped = {};
    
    appointments.forEach(appointment => {
      const dateKey = formatDate(appointment.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(appointment);
    });
    
    return grouped;
  };

  return (
    <>
    <NavBar/>
    <div className="view-myappointments-container">
      <h1 className="view-myappointments-title">My Appointments</h1>
      
      {updateSuccess && (
        <div className="view-myappointments-success-alert">
          Appointment updated successfully!
        </div>
      )}
      
      {cancelSuccess && (
        <div className="view-myappointments-success-alert">
          Appointment cancelled successfully!
        </div>
      )}
      
      {error && (
        <div className="view-myappointments-error-alert">
          {error}
          <button 
            className="view-myappointments-close-btn"
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="view-myappointments-loading">
          <div className="view-myappointments-loading-spinner"></div>
          <p>Loading your appointments...</p>
        </div>
      ) : !userEmail ? (
        <div className="view-myappointments-not-logged-in">
          <p>Please log in to view your appointments</p>
          <button 
            className="view-myappointments-login-btn"
            onClick={() => window.location.href = '/login'}
          >
            Go to Login
          </button>
        </div>
      ) : appointments.length === 0 ? (
        <div className="view-myappointments-no-appointments">
          <div className="view-myappointments-empty-state">
            <i className="view-myappointments-calendar-icon">📅</i>
            <h3>No Appointments Found</h3>
            <p>You don't have any appointments scheduled yet.</p>
            <button 
              className="view-myappointments-schedule-btn"
              onClick={() => window.location.href = '/schedule'}
            >
              Schedule an Appointment
            </button>
          </div>
        </div>
      ) : (
        <div className="view-myappointments-list">
          {editAppointment ? (
            <div className="view-myappointments-edit-form">
              <h3>Edit Appointment</h3>
              <div className="view-myappointments-form-group">
                <label>Pet Name:</label>
                <input 
                  type="text" 
                  value={editAppointment.petName}
                  disabled
                  className="view-myappointments-input"
                />
              </div>
              
              <div className="view-myappointments-form-group">
                <label>Service:</label>
                <input 
                  type="text" 
                  value={editAppointment.serviceType}
                  disabled
                  className="view-myappointments-input"
                />
              </div>
              
              <div className="view-myappointments-form-group">
                <label>Date:</label>
                <input 
                  type="date" 
                  value={editAppointment.date}
                  onChange={handleDateChange}
                  className="view-myappointments-input"
                />
              </div>
              
              <div className="view-myappointments-form-group">
                <label>Time:</label>
                <select 
                  value={editAppointment.time}
                  onChange={(e) => setEditAppointment({...editAppointment, time: e.target.value})}
                  className="view-myappointments-select"
                >
                  <option value="">Select a time</option>
                  {/* Include current time in available times */}
                  {!availableTimes.includes(editAppointment.time) && (
                    <option value={editAppointment.time}>{editAppointment.time} (Current)</option>
                  )}
                  {availableTimes.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              <div className="view-myappointments-form-group">
                <label>Notes:</label>
                <textarea 
                  value={editAppointment.notes}
                  onChange={(e) => setEditAppointment({...editAppointment, notes: e.target.value})}
                  className="view-myappointments-textarea"
                  placeholder="Any additional information"
                />
              </div>
              
              <div className="view-myappointments-button-group">
                <button 
                  className="view-myappointments-save-btn"
                  onClick={handleSave}
                  disabled={!editAppointment.time}
                >
                  Save Changes
                </button>
                <button 
                  className="view-myappointments-cancel-btn"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="view-myappointments-status-legend">
                <span className="view-myappointments-status-dot view-myappointments-status-scheduled"></span> Scheduled
                <span className="view-myappointments-status-dot view-myappointments-status-confirmed"></span> Confirmed
                <span className="view-myappointments-status-dot view-myappointments-status-completed"></span> Completed
                <span className="view-myappointments-status-dot view-myappointments-status-cancelled"></span> Cancelled
              </div>
              
              {Object.entries(groupAppointmentsByDate()).map(([date, dateAppointments]) => (
                <div key={date} className="view-myappointments-date-group">
                  <h3 className="view-myappointments-date-header">{date}</h3>
                  {dateAppointments.map(appointment => (
                    <div 
                      key={appointment._id} 
                      className={`view-myappointments-card ${
                        appointment.status === 'cancelled' ? 'view-myappointments-cancelled' : ''
                      } ${isAppointmentPast(appointment.date) ? 'view-myappointments-past' : ''}`}
                    >
                      <div className="view-myappointments-card-header">
                        <span className={`view-myappointments-status ${getStatusClass(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        <span className="view-myappointments-time">{appointment.time}</span>
                      </div>
                      
                      <div className="view-myappointments-card-body">
                        <div className="view-myappointments-pet-info">
                          <h4>{appointment.petName} ({appointment.petType})</h4>
                          <p className="view-myappointments-service">{appointment.serviceType}</p>
                        </div>
                        
                        {appointment.notes && (
                          <div className="view-myappointments-notes">
                            <p><strong>Notes:</strong> {appointment.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="view-myappointments-card-footer">
                        {!isAppointmentPast(appointment.date) && appointment.status !== 'cancelled' && (
                          <>
                            <button 
                              className="view-myappointments-edit-btn"
                              onClick={() => handleEdit(appointment)}
                            >
                              Edit
                            </button>
                            <button 
                              className="view-myappointments-cancel-appointment-btn"
                              onClick={() => handleCancel(appointment._id)}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default MyAppointments;