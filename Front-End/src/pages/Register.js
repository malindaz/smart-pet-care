import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CgSpinner } from "react-icons/cg";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt } from "react-icons/fa";
import axios from 'axios';
import "../css/Register.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
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

    const [validationErrors, setValidationErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        // Calculate password strength
        if (formData.password) {
            let strength = 0;
            if (formData.password.length >= 8) strength += 1;
            if (/[A-Z]/.test(formData.password)) strength += 1;
            if (/[0-9]/.test(formData.password)) strength += 1;
            if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
            setPasswordStrength(strength);
        } else {
            setPasswordStrength(0);
        }
    }, [formData.password]);

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

    const validateField = (name, value) => {
        let errors = {...validationErrors};
        
        switch(name) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                errors.email = !emailRegex.test(value) ? 'Invalid email format' : '';
                break;
            case 'password':
                errors.password = value.length < 6 ? 'Password must be at least 6 characters' : '';
                break;
            case 'confirmPassword':
                errors.confirmPassword = value !== formData.password ? 'Passwords do not match' : '';
                break;
            case 'phoneNumber':
                const phoneRegex = /^\d{10}$/;
                errors.phoneNumber = !phoneRegex.test(value.replace(/\D/g, '')) ? 'Please enter a valid 10-digit phone number' : '';
                break;
            default:
                break;
        }
        
        setValidationErrors(errors);
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            setLoading(true);
    
            // Validate password match
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match!');
                setLoading(false);
                return;
            }
    
            // Validate password strength
            if (formData.password.length < 6) {
                toast.error('Password must be at least 6 characters long');
                setLoading(false);
                return;
            }
    
            // Create FormData object for file upload
            const formDataObj = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'profileImage' && formData[key]) {
                    formDataObj.append('profileImage', formData[key]);
                } else if (key !== 'confirmPassword') {
                    formDataObj.append(key, formData[key]);
                }
            });
    
            const response = await axios.post('http://localhost:5000/api/users/register', formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            console.log("Response from server:", response.data); // Debugging
    
            if (response.data?.success) {
                toast.success('Registration successful! Redirecting to login...');
    
                // Delay navigation so the toast message is visible
                setTimeout(() => {
                    navigate('/login');
                }, 2000); // Wait 2 seconds before redirecting
    
                // Clear form data
                setFormData({
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
                setImagePreview(null);
            } else {
                toast.error(response.data?.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration Error:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    
    return (
        <div>
            <NavBar/>
            <br/><br/><br/>
        
        <div className="Registerpage-container">
            <div className="Registerpage-card">
                <div className="Registerpage-header">
                    <h1>Create Account</h1>
                   
                </div>
                
                <form className="Registerpage-form" onSubmit={handleSubmit}>
                    <div className="Registerpage-image-upload">
                        <div className="Registerpage-image-preview">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile Preview" />
                            ) : (
                                <div className="Registerpage-image-placeholder">
                                    {formData.firstName && formData.lastName ? 
                                        `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase() : 
                                        ''}
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            id="profileImage"
                            name="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="Registerpage-file-input"
                        />
                        <label htmlFor="profileImage" className="Registerpage-upload-button">
                            Choose Profile Picture
                        </label>
                    </div>

                    <div className="Registerpage-form-section">
                        <div className="Registerpage-input-group">
                            <div className="Registerpage-input-icon">
                                <FaUser />
                            </div>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="Registerpage-input-row">
                            <div className="Registerpage-input-group">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="Registerpage-input-group">
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="Registerpage-input-group">
                            <div className="Registerpage-input-icon">
                                <FaEnvelope />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                required
                            />
                        </div>
                        {validationErrors.email && 
                            <div className="Registerpage-error-message">{validationErrors.email}</div>}

                        <div className="Registerpage-input-group">
                            <div className="Registerpage-input-icon">
                                <FaPhone />
                            </div>
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                required
                            />
                        </div>
                        {validationErrors.phoneNumber && 
                            <div className="Registerpage-error-message">{validationErrors.phoneNumber}</div>}

                        <div className="Registerpage-input-group">
                            <div className="Registerpage-input-icon">
                                <FaLock />
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                required
                            />
                        </div>
                        {formData.password && 
                            <div className="Registerpage-password-strength">
                                <div className="Registerpage-strength-meter">
                                    <div 
                                        className={`Registerpage-strength-bar strength-${passwordStrength}`}
                                    ></div>
                                </div>
                                <span className="Registerpage-strength-text">
                                    {passwordStrength === 0 && "Weak"}
                                    {passwordStrength === 1 && "Fair"}
                                    {passwordStrength === 2 && "Good"}
                                    {passwordStrength === 3 && "Strong"}
                                    {passwordStrength === 4 && "Very Strong"}
                                </span>
                            </div>
                        }
                        {validationErrors.password && 
                            <div className="Registerpage-error-message">{validationErrors.password}</div>}

                        <div className="Registerpage-input-group">
                            <div className="Registerpage-input-icon">
                                <FaLock />
                            </div>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                required
                            />
                        </div>
                        {validationErrors.confirmPassword && 
                            <div className="Registerpage-error-message">{validationErrors.confirmPassword}</div>}

                        <div className="Registerpage-input-group">
                            <div className="Registerpage-input-icon">
                                <FaMapMarkerAlt />
                            </div>
                            <textarea
                                name="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="Registerpage-submit-button" disabled={loading}>
                        {loading ? <CgSpinner className="Registerpage-spinner" /> : 'Create Account'}
                    </button>

                    <div className="Registerpage-login-link">
                        Already have an account? <a href="/login">Log in</a>
                    </div>
                </form>
            </div>
        </div>
        <Footer/> 
        </div>
    );
};

export default Register;