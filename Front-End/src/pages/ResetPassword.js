import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../firebase';
import { confirmPasswordReset } from "firebase/auth";
import '../css/ResetPassword.css';

const ResetPassword = () => {
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        try {
            const oobCode = new URLSearchParams(window.location.search).get('oobCode');
            await confirmPasswordReset(auth, oobCode, formData.password);
            toast.success('Password reset successfully!');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to reset password');
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