import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase';
import axios from 'axios';
import '../css/ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Check if the email exists in the database before sending the email
            const response = await axios.post('http://localhost:5000/api/users/check-email', { email });
            if (response.data.exists) {
                await sendPasswordResetEmail(auth, email, {
                    url: 'http://localhost:3000/reset-password',
                    handleCodeInApp: true,
                });
                toast.success('Password reset link sent to your email!');
                window.localStorage.setItem('emailForSignIn', email);
                navigate('/verify-otp');
            } else {
                toast.error('Email does not exist');
            }
        } catch (error) {
            toast.error('Failed to send password reset link');
        }
    };

    return (
        <div className="forgot_password_container">
            <form className="forgot_password_form" onSubmit={handleSubmit}>
                <h2>Forgot Password</h2>
                <div className="forgot_password_form_group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="forgot_password_submit_button">Send Password Reset Link</button>
            </form>
        </div>
    );
};

export default ForgotPassword;