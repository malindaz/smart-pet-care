import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CgSpinner } from "react-icons/cg";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from 'axios';
import '../../css/loginpage.css';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            const response = await axios.post('http://localhost:5000/api/users/login', formData);
            
            if (response.data.success) {
                // Save token and user data
                localStorage.setItem('userToken', response.data.token);
                localStorage.setItem('userData', JSON.stringify(response.data.user));
                localStorage.setItem('userLevel', response.data.user.userLevel);
                localStorage.setItem('userEmail', response.data.user.email);
                
                toast.success('Login successful!');
                
                // Redirect based on user level
                const userLevel = response.data.user.userLevel;
                switch(userLevel) {
                    case 1:
                        navigate('/admin-dashboard');
                        break;
                    case 2:
                        navigate('/vet-dashboard');
                        break;
                    case 3:
                        navigate('/pharmacist-dashboard');
                        break;
                    default:
                        navigate('/');
                        break;
                }
            }
        } catch (error) {
            console.error('Login Error:', error);
            toast.error(error.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="loginpage-container">
            <div className="loginpage-card">
                <div className="loginpage-card-left">
                    <div className="loginpage-logo">
                        <h1>Smart Pet Care</h1>
                    </div>
                    <div className="loginpage-illustration">
                        {/* SVG or image could be added here */}
                    </div>
                    <div className="loginpage-welcome-text">
                        <p>Taking care of your pets has never been easier!</p>
                    </div>
                </div>
                
                <div className="loginpage-card-right">
                    <div className="loginpage-form-header">
                        <h2>Welcome Back</h2>
                        <p>Please login to your account</p>
                    </div>
                    
                    <form className="loginpage-form" onSubmit={handleSubmit}>
                        <div className="loginpage-form-group">
                            <div className="loginpage-input-icon">
                                <FaEnvelope />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="loginpage-input"
                            />
                        </div>

                        <div className="loginpage-form-group">
                            <div className="loginpage-input-icon">
                                <FaLock />
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="loginpage-input"
                            />
                        </div>

                        <div className="loginpage-forgot-password">
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>

                        <button type="submit" className="loginpage-submit-button" disabled={loading}>
                            {loading ? (
                                <><CgSpinner className="loginpage-spinner" />Logging in...</>
                            ) : (
                                'Login'
                            )}
                        </button>
                        
                        <div className="loginpage-register-link">
                            Don't have an account? <Link to="/register">Register</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;