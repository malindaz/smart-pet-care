import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        profileImage: null
    });

    const [phoneOTP, setPhoneOTP] = useState('');
    const [emailOTP, setEmailOTP] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [showResendPhoneOTP, setShowResendPhoneOTP] = useState(false);
    const [showResendEmailOTP, setShowResendEmailOTP] = useState(false);

    useEffect(() => {
        let phoneTimer, emailTimer;
        if (step === 2) {
            phoneTimer = setTimeout(() => setShowResendPhoneOTP(true), 600000); // 10 minutes
        }
        if (step === 3) {
            emailTimer = setTimeout(() => setShowResendEmailOTP(true), 600000); // 10 minutes
        }
        return () => {
            clearTimeout(phoneTimer);
            clearTimeout(emailTimer);
        };
    }, [step]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                profileImage: file
            }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const getInitials = () => {
        return formData.firstName && formData.lastName
            ? `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase()
            : '';
    };

    const sendPhoneOTP = async () => {
        try {
            await axios.post('http://localhost:5000/api/users/send-phone-verification', {
                phoneNumber: formData.phoneNumber
            });
            toast.success('OTP sent to your phone number');
            setShowResendPhoneOTP(false);
            setTimeout(() => setShowResendPhoneOTP(true), 600000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        }
    };

    const sendEmailOTP = async () => {
        try {
            await axios.post('http://localhost:5000/api/users/send-email-verification', {
                email: formData.email
            });
            toast.success('OTP sent to your email');
            setShowResendEmailOTP(false);
            setTimeout(() => setShowResendEmailOTP(true), 600000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        }
    };

    const verifyPhoneOTP = async () => {
        try {
            await axios.post('http://localhost:5000/api/users/verify-phone', {
                phoneNumber: formData.phoneNumber,
                code: phoneOTP
            });
            setPhoneVerified(true);
            toast.success('Phone number verified successfully');
            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        }
    };

    const verifyEmailOTP = async () => {
        try {
            await axios.post('http://localhost:5000/api/users/verify-email', {
                email: formData.email,
                code: emailOTP
            });
            setEmailVerified(true);
            toast.success('Email verified successfully');
            setStep(4);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const formDataObj = new FormData();
            Object.keys(formData).forEach(key => {
                if (key !== 'confirmPassword') {
                    formDataObj.append(key, formData[key]);
                }
            });

            const response = await axios.post('http://localhost:5000/api/users/register', formDataObj);
            
            if (response.data.success) {
                toast.success('Registration successful!');
                localStorage.setItem('userToken', response.data.user.token);
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="registration_form_step">
                        <h2>Basic Information</h2>
                        <div className="form_group">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form_group">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form_group">
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button onClick={() => setStep(2)} className="next_button">Next</button>
                    </div>
                );

            case 2:
                return (
                    <div className="registration_form_step">
                        <h2>Phone Verification</h2>
                        <div className="form_group">
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                disabled={phoneVerified}
                                required
                            />
                        </div>
                        {!phoneVerified && (
                            <>
                                <button onClick={sendPhoneOTP} className="otp_button" disabled={!formData.phoneNumber}>
                                    Get OTP
                                </button>
                                <div className="form_group">
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={phoneOTP}
                                        onChange={(e) => setPhoneOTP(e.target.value)}
                                    />
                                </div>
                                <button onClick={verifyPhoneOTP} className="verify_button" disabled={!phoneOTP}>
                                    Verify Phone
                                </button>
                                {showResendPhoneOTP && (
                                    <button onClick={sendPhoneOTP} className="resend_button">
                                        Resend OTP
                                    </button>
                                )}
                            </>
                        )}
                        <div className="button_group">
                            <button onClick={() => setStep(1)} className="back_button">Back</button>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="registration_form_step">
                        <h2>Email Verification</h2>
                        <div className="form_group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={emailVerified}
                                required
                            />
                        </div>
                        {!emailVerified && (
                            <>
                                <button onClick={sendEmailOTP} className="otp_button" disabled={!formData.email}>
                                    Get OTP
                                </button>
                                <div className="form_group">
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={emailOTP}
                                        onChange={(e) => setEmailOTP(e.target.value)}
                                    />
                                </div>
                                <button onClick={verifyEmailOTP} className="verify_button" disabled={!emailOTP}>
                                    Verify Email
                                </button>
                                {showResendEmailOTP && (
                                    <button onClick={sendEmailOTP} className="resend_button">
                                        Resend OTP
                                    </button>
                                )}
                            </>
                        )}
                        <div className="button_group">
                            <button onClick={() => setStep(2)} className="back_button">Back</button>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="registration_form_step">
                        <h2>Complete Profile</h2>
                        <div className="form_group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form_group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form_group">
                            <textarea
                                name="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="profile_image_section">
                            <div className="image_preview">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile preview" />
                                ) : (
                                    <div className="initials_preview">{getInitials()}</div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="file_input"
                            />
                        </div>
                        <div className="button_group">
                            <button onClick={() => setStep(3)} className="back_button">Back</button>
                            <button onClick={handleSubmit} className="submit_button">Register</button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="registration_container">
            <div className="registration_progress">
                <div className={`progress_step ${step >= 1 ? 'active' : ''}`}>1</div>
                <div className={`progress_step ${step >= 2 ? 'active' : ''}`}>2</div>
                <div className={`progress_step ${step >= 3 ? 'active' : ''}`}>3</div>
                <div className={`progress_step ${step >= 4 ? 'active' : ''}`}>4</div>
            </div>
            <form className="registration_form">
                {renderStep()}
            </form>
        </div>
    );
};

export default Register; 