import React, { useState } from 'react';
import axios from 'axios';
import '../../css/User/appointmentcheckout.css';

const AppointmentCheckout = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  
  // State for error handling and payment status
  const [errors, setErrors] = useState({});
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please use MM/YY format';
    }
    
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    if (!formData.nameOnCard.trim()) newErrors.nameOnCard = 'Name on card is required';
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API call - replace with your actual API endpoint
      // const response = await axios.post('/api/payments', { ...formData, amount: 1000 });
      
      // Simulate successful payment with a timeout
      setTimeout(() => {
        setPaymentStatus('success');
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('failed');
      setIsProcessing(false);
    }
  };

  // Format card number with spaces every 4 digits
  const formatCardNumber = (e) => {
    const { value } = e.target;
    const formattedValue = value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
    
    setFormData({
      ...formData,
      cardNumber: formattedValue
    });
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (e) => {
    const { value } = e.target;
    let formattedValue = value.replace(/\D/g, '');
    
    if (formattedValue.length > 2) {
      formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
    }
    
    setFormData({
      ...formData,
      expiryDate: formattedValue
    });
  };

  // Show success message after payment
  if (paymentStatus === 'success') {
    return (
      <div className="appointment-checkout-container">
        <div className="appointment-checkout-success">
          <div className="appointment-checkout-success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Your appointment has been confirmed.</p>
          <p>A confirmation email has been sent to {formData.email}</p>
          <button 
            className="appointment-checkout-button"
            onClick={() => window.location.href = '/appointments'}
          >
            View My Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-checkout-container">
      <div className="appointment-checkout-header">
        <h1>Appointment Payment</h1>
        <p>Complete your payment to confirm your appointment</p>
      </div>
      
      <div className="appointment-checkout-main">
        <div className="appointment-checkout-summary">
          <h2>Appointment Summary</h2>
          <div className="appointment-checkout-details">
            <div className="appointment-checkout-detail-row">
              <span>Service:</span>
              <span>Consultation</span>
            </div>
            <div className="appointment-checkout-detail-row">
              <span>Duration:</span>
              <span>60 minutes</span>
            </div>
            <div className="appointment-checkout-detail-row appointment-checkout-total">
              <span>Total:</span>
              <span>LKR 1,000.00</span>
            </div>
          </div>
        </div>
        
        <div className="appointment-checkout-payment">
          <h2>Payment Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="appointment-checkout-form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={errors.fullName ? 'appointment-checkout-error-input' : ''}
              />
              {errors.fullName && <span className="appointment-checkout-error">{errors.fullName}</span>}
            </div>
            
            <div className="appointment-checkout-form-row">
              <div className="appointment-checkout-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={errors.email ? 'appointment-checkout-error-input' : ''}
                />
                {errors.email && <span className="appointment-checkout-error">{errors.email}</span>}
              </div>
              
              <div className="appointment-checkout-form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="077 123 4567"
                  className={errors.phone ? 'appointment-checkout-error-input' : ''}
                />
                {errors.phone && <span className="appointment-checkout-error">{errors.phone}</span>}
              </div>
            </div>
            
            <div className="appointment-checkout-divider"></div>
            
            <div className="appointment-checkout-form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                onBlur={formatCardNumber}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className={errors.cardNumber ? 'appointment-checkout-error-input' : ''}
              />
              {errors.cardNumber && <span className="appointment-checkout-error">{errors.cardNumber}</span>}
            </div>
            
            <div className="appointment-checkout-form-row">
              <div className="appointment-checkout-form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  onBlur={formatExpiryDate}
                  placeholder="MM/YY"
                  maxLength="5"
                  className={errors.expiryDate ? 'appointment-checkout-error-input' : ''}
                />
                {errors.expiryDate && <span className="appointment-checkout-error">{errors.expiryDate}</span>}
              </div>
              
              <div className="appointment-checkout-form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength="4"
                  className={errors.cvv ? 'appointment-checkout-error-input' : ''}
                />
                {errors.cvv && <span className="appointment-checkout-error">{errors.cvv}</span>}
              </div>
            </div>
            
            <div className="appointment-checkout-form-group">
              <label htmlFor="nameOnCard">Name on Card</label>
              <input
                type="text"
                id="nameOnCard"
                name="nameOnCard"
                value={formData.nameOnCard}
                onChange={handleChange}
                placeholder="John Doe"
                className={errors.nameOnCard ? 'appointment-checkout-error-input' : ''}
              />
              {errors.nameOnCard && <span className="appointment-checkout-error">{errors.nameOnCard}</span>}
            </div>
            
            <div className="appointment-checkout-amount-display">
              <span>Payment Amount:</span>
              <span className="appointment-checkout-amount">LKR 1,000.00</span>
            </div>
            
            <button 
              type="submit" 
              className="appointment-checkout-button"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
            
            {paymentStatus === 'failed' && (
              <div className="appointment-checkout-payment-error">
                Payment failed. Please check your details and try again.
              </div>
            )}
          </form>
        </div>
      </div>
      
      <div className="appointment-checkout-footer">
        <p>Your payment is secure and encrypted</p>
        <div className="appointment-checkout-secure">
          <span className="appointment-checkout-lock-icon">🔒</span>
          <span>Secure Payment</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCheckout;