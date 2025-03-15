import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetPhone, setResetPhone] = useState('');
    const [verificationStep, setVerificationStep] = useState('initial');
    const [otp, setOtp] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', formData);
            
            if (response.data.success) {
                localStorage.setItem('userToken', response.data.user.token);
                toast.success('Login successful!');
                navigate('/home');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    const handleSendOTP = async (type) => {
        try {
            const endpoint = type === 'email' 
                ? 'send-email-verification'
                : 'send-phone-verification';
            
            const data = type === 'email'
                ? { email: resetEmail }
                : { phoneNumber: resetPhone };

            await axios.post(`http://localhost:5000/api/users/${endpoint}`, data);
            
            toast.success(`OTP sent to your ${type}`);
            setVerificationStep(type);
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to send OTP to ${type}`);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const endpoint = verificationStep === 'email'
                ? 'verify-email'
                : 'verify-phone';
            
            const data = verificationStep === 'email'
                ? { email: resetEmail, code: otp }
                : { phoneNumber: resetPhone, code: otp };

            await axios.post(`http://localhost:5000/api/users/${endpoint}`, data);
            
            toast.success('Verification successful');
            setVerificationStep('resetPassword');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        }
    };

    const renderForgotPasswordForm = () => {
        switch (verificationStep) {
            case 'initial':
                return (
                    <div className="forgot_password_form">
                        <h3>Reset Password</h3>
                        <div className="form_group">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                            />
                            <button onClick={() => handleSendOTP('email')} className="otp_button">
                                Send Email OTP
                            </button>
                        </div>
                        <div className="form_group">
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                value={resetPhone}
                                onChange={(e) => setResetPhone(e.target.value)}
                            />
                            <button onClick={() => handleSendOTP('phone')} className="otp_button">
                                Send Phone OTP
                            </button>
                        </div>
                        <button onClick={() => setShowForgotPassword(false)} className="back_button">
                            Back to Login
                        </button>
                    </div>
                );

            case 'email':
            case 'phone':
                return (
                    <div className="verification_form">
                        <h3>Enter OTP</h3>
                        <div className="form_group">
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <button onClick={handleVerifyOTP} className="verify_button">
                                Verify OTP
                            </button>
                        </div>
                        <button onClick={() => setVerificationStep('initial')} className="back_button">
                            Back
                        </button>
                    </div>
                );

            case 'resetPassword':
                return (
                    <div className="reset_password_form">
                        <h3>Set New Password</h3>
                        <div className="form_group">
                            <input
                                type="password"
                                placeholder="New Password"
                            />
                        </div>
                        <div className="form_group">
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                            />
                        </div>
                        <button className="submit_button">Reset Password</button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="login_container">
            {!showForgotPassword ? (
                <form onSubmit={handleLogin} className="login_form">
                    <h2>Login</h2>
                    <div className="form_group">
                        <input
                            type="text"
                            name="login"
                            placeholder="Username or Email"
                            value={formData.login}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
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
                    <button type="submit" className="login_button">Login</button>
                    <p className="forgot_password_link" onClick={() => setShowForgotPassword(true)}>
                        Forgot Password?
                    </p>
                    <p className="register_link" onClick={() => navigate('/register')}>
                        Don't have an account? Register
                    </p>
                </form>
            ) : (
                renderForgotPasswordForm()
            )}
        </div>
    );
};

export default Login; 