import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/User/AppointmentForm.css';
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    petName: '',
    petType: '',
    ownerName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    serviceType: '',
    notes: ''
  });
  
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  
  // Updated to match the enum values in the Appointment model
  const serviceTypes = [
    "Regular Checkup",
    "Vaccination",
    "Grooming",
    "Dental Care",
    "Specialized Treatment",
    "Emergency Care"
  ];

  // Get user's email from localStorage when component mounts
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setFormData(prevData => ({
        ...prevData,
        email: userEmail
      }));
    }
  }, []);

  // Fetch available times when date changes
  useEffect(() => {
    if (formData.date) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/appointments/available-times?date=${formData.date}`)
        .then(response => {
          setAvailableTimes(response.data.availableTimes);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching available times:', error);
          setLoading(false);
          setMessage({ 
            text: 'Failed to fetch available times. Please try again.', 
            type: 'error' 
          });
        });
    }
  }, [formData.date]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.petName.trim()) newErrors.petName = 'Pet name is required';
    if (!formData.petType) newErrors.petType = 'Please select a pet type';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.serviceType) newErrors.serviceType = 'Please select a service type';
    if (!formData.date) newErrors.date = 'Please select a date';
    if (!formData.time) newErrors.time = 'Please select a time';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ text: 'Please fix the errors in the form', type: 'error' });
      return;
    }
    
    setLoading(true);
    
    try {
      // Log the form data before submission to verify it's complete
      console.log("Form data before submission:", formData);
      
      const response = await axios.post('http://localhost:5000/api/appointments', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setMessage({ 
        text: 'Appointment scheduled successfully! A confirmation email has been sent to your inbox.', 
        type: 'success' 
      });
      
      // Reset form but keep email
      const userEmail = formData.email;
      setFormData({
        petName: '',
        petType: '',
        ownerName: '',
        email: userEmail, // Keep the email
        phone: '',
        date: '',
        time: '',
        serviceType: '',
        notes: ''
      });
      
      // Reset to first step
      setCurrentStep(1);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to schedule appointment. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  const petTypes = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other'];
  
  // Get min date (today's date)
  const today = new Date().toISOString().split('T')[0];
  
  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate pet info
      const petInfoErrors = {};
      if (!formData.petName.trim()) petInfoErrors.petName = 'Pet name is required';
      if (!formData.petType) petInfoErrors.petType = 'Please select a pet type';
      
      if (Object.keys(petInfoErrors).length > 0) {
        setErrors(petInfoErrors);
        return;
      }
    } else if (currentStep === 2) {
      // Validate owner info
      const ownerInfoErrors = {};
      if (!formData.ownerName.trim()) ownerInfoErrors.ownerName = 'Owner name is required';
      
      if (!formData.email.trim()) {
        ownerInfoErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        ownerInfoErrors.email = 'Please enter a valid email address';
      }
      
      if (!formData.phone.trim()) {
        ownerInfoErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        ownerInfoErrors.phone = 'Please enter a valid 10-digit phone number';
      }
      
      if (Object.keys(ownerInfoErrors).length > 0) {
        setErrors(ownerInfoErrors);
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSelectPetType = (type) => {
    setFormData(prev => ({
      ...prev,
      petType: type
    }));
    
    if (errors.petType) {
      setErrors({
        ...errors,
        petType: ''
      });
    }
  };
  
  const handleSelectTimeSlot = (time) => {
    setFormData(prev => ({
      ...prev,
      time: time
    }));
    
    if (errors.time) {
      setErrors({
        ...errors,
        time: ''
      });
    }
  };
  
  return (
    <>
     <NavBar /> 
    <div className="book-appointment-container">
      <h2 className="book-appointment-title">Schedule a Pet Care Appointment</h2>
      
      {message.text && (
        <div className={`book-appointment-message book-appointment-${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="book-appointment-progress">
        <div className={`book-appointment-progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          1
          <span className="book-appointment-progress-label">Pet Info</span>
        </div>
        <div className={`book-appointment-progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          2
          <span className="book-appointment-progress-label">Owner Info</span>
        </div>
        <div className={`book-appointment-progress-step ${currentStep >= 3 ? 'active' : ''}`}>
          3
          <span className="book-appointment-progress-label">Appointment</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="book-appointment-form">
        {currentStep === 1 && (
          <div className="book-appointment-section">
            <h3 className="book-appointment-section-title">Pet Information</h3>
            
            <div className="book-appointment-form-group">
              <label htmlFor="petName" className="book-appointment-label">Pet Name *</label>
              <input
                type="text"
                id="petName"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                className={`book-appointment-input ${errors.petName ? 'error' : ''}`}
              />
              {errors.petName && <p className="book-appointment-error-text">{errors.petName}</p>}
            </div>
            
            <label className="book-appointment-label">Pet Type *</label>
            <div className="book-appointment-pet-icons">
              {petTypes.map(type => (
                <div 
                  key={type}
                  className={`book-appointment-pet-icon ${formData.petType === type ? 'active' : ''}`}
                  onClick={() => handleSelectPetType(type)}
                >
                  <span>{type}</span>
                </div>
              ))}
            </div>
            {errors.petType && <p className="book-appointment-error-text">{errors.petType}</p>}
            
            <div className="book-appointment-actions">
              <button 
                type="button" 
                className="book-appointment-button"
                onClick={handleNextStep}
              >
                Next Step
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="book-appointment-section">
            <h3 className="book-appointment-section-title">Owner Information</h3>
            
            <div className="book-appointment-form-group">
              <label htmlFor="ownerName" className="book-appointment-label">Your Name *</label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                className={`book-appointment-input ${errors.ownerName ? 'error' : ''}`}
              />
              {errors.ownerName && <p className="book-appointment-error-text">{errors.ownerName}</p>}
            </div>
            
            <div className="book-appointment-form-row">
              <div className="book-appointment-form-group">
                <label htmlFor="email" className="book-appointment-label">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  onChange={handleChange}
                  className={`book-appointment-input ${errors.email ? 'error' : ''}`}
                  readOnly={!!localStorage.getItem('email')}
                />
                {errors.email && <p className="book-appointment-error-text">{errors.email}</p>}
              </div>
              
              <div className="book-appointment-form-group">
                <label htmlFor="phone" className="book-appointment-label">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`book-appointment-input ${errors.phone ? 'error' : ''}`}
                  placeholder="(123) 456-7890"
                />
                {errors.phone && <p className="book-appointment-error-text">{errors.phone}</p>}
              </div>
            </div>
            
            <div className="book-appointment-actions">
              <button 
                type="button" 
                className="book-appointment-button"
                onClick={handlePrevStep}
                style={{ marginRight: '1rem', backgroundColor: '#6c757d' }}
              >
                Previous
              </button>
              <button 
                type="button" 
                className="book-appointment-button"
                onClick={handleNextStep}
              >
                Next Step
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="book-appointment-section">
            <h3 className="book-appointment-section-title">Appointment Details</h3>
            
            <div className="book-appointment-form-group">
              <label htmlFor="serviceType" className="book-appointment-label">Service Type *</label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className={`book-appointment-select ${errors.serviceType ? 'error' : ''}`}
              >
                <option value="">Select Service</option>
                {serviceTypes.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
              {errors.serviceType && <p className="book-appointment-error-text">{errors.serviceType}</p>}
            </div>
            
            <div className="book-appointment-form-group">
              <label htmlFor="date" className="book-appointment-label">Preferred Date *</label>
              <div className="book-appointment-date-container">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  className={`book-appointment-input ${errors.date ? 'error' : ''}`}
                />
                {errors.date && <p className="book-appointment-error-text">{errors.date}</p>}
              </div>
            </div>
            
            <div className="book-appointment-form-group">
              <label htmlFor="time" className="book-appointment-label">Preferred Time *</label>
              {loading ? (
                <div className="book-appointment-loading">Loading available times...</div>
              ) : !formData.date ? (
                <div className="book-appointment-info">Please select a date first</div>
              ) : availableTimes.length === 0 ? (
                <div className="book-appointment-info">No available times for selected date</div>
              ) : (
                <div className="book-appointment-time-slots">
                  {availableTimes.map(time => (
                    <div 
                      key={time}
                      className={`book-appointment-time-slot ${formData.time === time ? 'active' : ''}`}
                      onClick={() => handleSelectTimeSlot(time)}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              )}
              {errors.time && <p className="book-appointment-error-text">{errors.time}</p>}
            </div>
            
            <div className="book-appointment-form-group">
              <label htmlFor="notes" className="book-appointment-label">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="book-appointment-textarea"
                placeholder="Any specific concerns or requirements?"
              ></textarea>
            </div>
            
            <div className="book-appointment-actions">
              <button 
                type="button" 
                className="book-appointment-button"
                onClick={handlePrevStep}
                style={{ marginRight: '1rem', backgroundColor: '#6c757d' }}
              >
                Previous
              </button>
              <button 
                type="submit" 
                className="book-appointment-button"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Schedule Appointment'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
    <Footer/>
    </>
  );
};

export default AppointmentForm;