import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../css/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpData, setOtpData] = useState({
    emailOtp: '',
    phoneOtp: '',
  });
  const [countdown, setCountdown] = useState(0);
  const [verificationStep, setVerificationStep] = useState('initial'); // 'initial', 'phone', 'email', 'complete'
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [phoneOtpCountdown, setPhoneOtpCountdown] = useState(0);
  const [emailOtpCountdown, setEmailOtpCountdown] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOtpChange = (e) => {
    setOtpData({
      ...otpData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    if (!isPhoneVerified) {
      toast.error('Phone number must be verified');
      return false;
    }
    if (!isEmailVerified) {
      toast.error('Email must be verified');
      return false;
    }
    return true;
  };

  const handleSendPhoneOTP = async () => {
    if (!formData.phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }
    
    // Format phone number to E.164 format
    let phoneNumber = formData.phoneNumber;
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '+94' + phoneNumber.substring(1); // Adding Sri Lanka country code
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/users/send-phone-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('OTP sent to your phone');
        setIsPhoneOtpSent(true);
        setPhoneOtpCountdown(60); // 60 seconds countdown
        setVerificationStep('phone');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    }
  };

  const handleSendEmailOTP = async () => {
    if (!formData.email) {
      toast.error('Please enter an email');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/users/send-email-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('OTP sent to your email');
        setIsEmailOtpSent(true);
        setEmailOtpCountdown(60); // 60 seconds countdown
        setVerificationStep('email');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    }
  };

  const verifyPhoneOTP = async () => {
    if (!otpData.phoneOtp) {
      toast.error('Please enter the phone OTP');
      return;
    }
    
    // Format phone number to E.164 format
    let phoneNumber = formData.phoneNumber;
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '+94' + phoneNumber.substring(1); // Adding Sri Lanka country code
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/users/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber,
          code: otpData.phoneOtp 
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Phone number verified successfully');
        setIsPhoneVerified(true);
        setVerificationStep(isEmailVerified ? 'complete' : 'email');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    }
  };

  const verifyEmailOTP = async () => {
    if (!otpData.emailOtp) {
      toast.error('Please enter the email OTP');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/users/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email,
          code: otpData.emailOtp 
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Email verified successfully');
        setIsEmailVerified(true);
        setVerificationStep(isPhoneVerified ? 'complete' : 'phone');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'confirmPassword') {
          formDataToSend.append(key, formData[key]);
        }
      });
      formDataToSend.append('isPhoneVerified', isPhoneVerified);
      formDataToSend.append('isEmailVerified', isEmailVerified);
      
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Registration successful!');
        navigate('/login');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  // Handle phone OTP countdown
  useEffect(() => {
    if (phoneOtpCountdown > 0) {
      const timer = setTimeout(() => setPhoneOtpCountdown(phoneOtpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [phoneOtpCountdown]);

  // Handle email OTP countdown
  useEffect(() => {
    if (emailOtpCountdown > 0) {
      const timer = setTimeout(() => setEmailOtpCountdown(emailOtpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [emailOtpCountdown]);

  return (
    <div className="register_container">
      <div className="register_form_container">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="register_form">
          <div className="register_image_upload">
            <div className="register_image_preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile preview" />
              ) : (
                <div className="register_image_placeholder">
                  {formData.firstName && formData.lastName ? (
                    `${formData.firstName[0]}${formData.lastName[0]}`
                  ) : (
                    'Upload Photo'
                  )}
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="profile-image"
              hidden
            />
            <label htmlFor="profile-image" className="register_upload_button">
              Choose Photo
            </label>
          </div>

          <div className="register_form_group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>

          <div className="register_form_row">
            <div className="register_form_group">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
              />
            </div>
            <div className="register_form_group">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
              />
            </div>
          </div>

          <div className="register_form_group phone_verification_group">
            <div className="register_input_with_button">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                disabled={isPhoneVerified}
              />
              {!isPhoneVerified && (
                <button 
                  type="button" 
                  onClick={handleSendPhoneOTP}
                  disabled={phoneOtpCountdown > 0 || isPhoneVerified}
                  className="register_send_otp_button"
                >
                  {phoneOtpCountdown > 0 ? `Resend in ${phoneOtpCountdown}s` : 'Send OTP'}
                </button>
              )}
              {isPhoneVerified && (
                <span className="register_verified_badge">Verified</span>
              )}
            </div>
            
            {isPhoneOtpSent && !isPhoneVerified && (
              <div className="register_otp_input_group">
                <input
                  type="text"
                  name="phoneOtp"
                  value={otpData.phoneOtp}
                  onChange={handleOtpChange}
                  placeholder="Enter Phone OTP"
                  maxLength="6"
                />
                <button 
                  type="button" 
                  onClick={verifyPhoneOTP}
                  className="register_verify_button"
                >
                  Verify
                </button>
              </div>
            )}
          </div>

          <div className="register_form_group email_verification_group">
            <div className="register_input_with_button">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                disabled={isEmailVerified}
              />
              {!isEmailVerified && (
                <button 
                  type="button" 
                  onClick={handleSendEmailOTP}
                  disabled={emailOtpCountdown > 0 || isEmailVerified}
                  className="register_send_otp_button"
                >
                  {emailOtpCountdown > 0 ? `Resend in ${emailOtpCountdown}s` : 'Send OTP'}
                </button>
              )}
              {isEmailVerified && (
                <span className="register_verified_badge">Verified</span>
              )}
            </div>
            
            {isEmailOtpSent && !isEmailVerified && (
              <div className="register_otp_input_group">
                <input
                  type="text"
                  name="emailOtp"
                  value={otpData.emailOtp}
                  onChange={handleOtpChange}
                  placeholder="Enter Email OTP"
                  maxLength="6"
                />
                <button 
                  type="button" 
                  onClick={verifyEmailOTP}
                  className="register_verify_button"
                >
                  Verify
                </button>
              </div>
            )}
          </div>

          <div className="register_form_group">
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              required
            />
          </div>

          <div className="register_form_row">
            <div className="register_form_group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>
            <div className="register_form_group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="register_submit_button"
            disabled={!isPhoneVerified || !isEmailVerified}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;