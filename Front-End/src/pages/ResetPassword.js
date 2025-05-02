import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../firebase';
import { confirmPasswordReset } from "firebase/auth";
import axios from 'axios';
import '../css/ResetPassword.css';

const ResetPassword = () => {
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate password
        if (!formData.password || formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        try {
            const oobCode = new URLSearchParams(window.location.search).get('oobCode');
            if (!oobCode) {
                toast.error('Invalid reset link');
                return;
            }

            // First reset password in Firebase
            await confirmPasswordReset(auth, oobCode, formData.password);
            
            // Get email from localStorage
            const email = localStorage.getItem('emailForSignIn');
            
            if (!email) {
                toast.error('Email not found. Please try the reset process again.');
                navigate('/forgot-password');
                return;
            }

            // Update password in our database
            try {
                await axios.post('http://localhost:5000/api/users/update-password', {
                    email,
                    newPassword: formData.password
                });
                toast.success('Password reset successfully!');
                localStorage.removeItem('emailForSignIn'); // Clean up
                navigate('/login');
            } catch (dbError) {
                console.error('Database update error:', dbError);
                toast.error('Password updated in authentication but failed to update in database.');
                navigate('/login');
            }
        } catch (error) {
            console.error('Reset error:', error);
            if (error.code === 'auth/invalid-action-code') {
                toast.error('Reset link is invalid or has expired. Please try again.');
            } else {
                toast.error('Failed to reset password. Please try again.');
            }
        }
    };

    return (
        <div className="reset_password_container">
            <form className="reset_password_form" onSubmit={handleSubmit}>
                <h2>Reset Password</h2>
                <div className="reset_password_form_group">
                    <input
                        type="password"
                        name="password"
                        placeholder="New Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="reset_password_form_group">
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="reset_password_submit_button">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;