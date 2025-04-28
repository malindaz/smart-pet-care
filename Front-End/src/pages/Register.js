import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CgSpinner } from "react-icons/cg";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import "../css/Register.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            if (/[a-z]/.test(formData.password)) strength += 1;
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
        
        // Clear validation errors when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                setValidationErrors(prev => ({
                    ...prev,
                    profileImage: 'Only image files are allowed'
                }));
                return;
            }
            
            // Check file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setValidationErrors(prev => ({
                    ...prev,
                    profileImage: 'Image size should not exceed 5MB'
                }));
                return;
            }
            
            setFormData(prev => ({
                ...prev,
                profileImage: file
            }));
            setImagePreview(URL.createObjectURL(file));
            
            // Clear any previous errors
            if (validationErrors.profileImage) {
                setValidationErrors(prev => ({
                    ...prev,
                    profileImage: ''
                }));
            }
        }
    };
    
    // Add a function to remove the profile image
    const removeProfileImage = () => {
        setFormData(prev => ({
            ...prev,
            profileImage: null
        }));
        setImagePreview(null);
        
        // Reset the file input
        const fileInput = document.getElementById('profileImage');
        if (fileInput) fileInput.value = '';
        
        // Clear any profile image errors
        if (validationErrors.profileImage) {
            setValidationErrors(prev => ({
                ...prev,
                profileImage: ''
            }));
        }
    };

    const validateField = (name, value) => {
        let errors = {...validationErrors};
        
        switch(name) {
            case 'username':
                if (!value.trim()) {
                    errors.username = 'Username is required';
                } else if (/\s/.test(value)) {
                    errors.username = 'Username cannot contain spaces';
                }
    
                else if (!/^[a-zA-Z0-9]+$/.test(value)) {
                    errors.username = 'Username can only contain Letters and Numbers';
                }else if (value.length < 3) {
                    errors.username = 'Username must be at least 3 characters';
                } else if (value.length > 10) {
                    errors.username = 'Username cannot exceed 10 characters';
                }
                
                else {
                    errors.username = '';
                }
                break;
                
            case 'firstName':
            case 'lastName':
                if (!value.trim()) {
                    errors[name] = `${name === 'firstName' ? 'First name' : 'Last name'} is required`;
                }else if (/\s/.test(value)) {
                    errors[name] = `${name === 'firstName' ? 'First name' : 'Last name'} cannot contain spaces`;  
                } 
                else if (!/^[a-zA-Z']+$/.test(value)) {
                    errors[name] = `${name === 'firstName' ? 'First name' : 'Last name'} can only contain letters`;
                } else if (value.length > 30) {
                    errors[name] = `${name === 'firstName' ? 'First name' : 'Last name'} cannot exceed 50 characters`;
                }
                else {
                    errors[name] = '';
                }
                break;
                
            case 'phoneNumber':
                if (!value.trim()) {
                    errors.phoneNumber = 'Phone number is required';
                } else if (/\s/.test(value)) {
                    errors.phoneNumber = 'Phone number cannot contain spaces';
                }
                
                else if (!/^\d+$/.test(value)) {
                    errors.phoneNumber = 'Phone number can only contain digits';
                } else if (value.length !== 10) {
                    errors.phoneNumber = 'Phone number must be 10 digits';
                } else if (value[0] !== '0') {
                    errors.phoneNumber = 'Phone number must start with 0';
                } else {
                    errors.phoneNumber = '';
                }
                break;
                
            case 'email':
                if (!value.trim()) {
                    errors.email = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors.email = 'Invalid email format';
                } else {
                    errors.email = '';
                }
                break;
                
            case 'password':
                if (!value) {
                    errors.password = 'Password is required';
                } else if (value.length < 8) {
                    errors.password = 'Password must be at least 8 characters';
                } else {
                    errors.password = '';
                }
                
                // Check confirm password field match if it's already been entered
                if (formData.confirmPassword && formData.confirmPassword !== value) {
                    errors.confirmPassword = 'Passwords do not match';
                } else if (formData.confirmPassword) {
                    errors.confirmPassword = '';
                }
                break;
                
            case 'confirmPassword':
                if (!value) {
                    errors.confirmPassword = 'Please confirm your password';
                } else if (value !== formData.password) {
                    errors.confirmPassword = 'Passwords do not match';
                } else {
                    errors.confirmPassword = '';
                }
                break;
                
            case 'address':
                if (!value.trim()) {
                    errors.address = 'Address is required';
                } else {
                    errors.address = '';
                }
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

    const validateForm = () => {
        // Validate all fields
        Object.keys(formData).forEach(key => {
            if (key !== 'profileImage') { // Profile image is optional
                validateField(key, formData[key]);
            }
        });
        
        // Check if there are any errors
        for (const key in validationErrors) {
            if (validationErrors[key] && key !== 'profileImage') {
                return false;
            }
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }
    
        try {
            setLoading(true);
    
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
    
    const getPasswordStrengthText = () => {
        switch(passwordStrength) {
            case 0: return "Weak";
            case 1: return "Weak";
            case 2: return "Fair";
            case 3: return "Good";
            case 4:return "Strong";
            case 5: return "Very Strong";
            default: return "Weak";
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
                                <>
                                    <img src={imagePreview} alt="Profile Preview" />
                                    <button 
                                        type="button"
                                        className="Registerpage-remove-image"
                                        onClick={removeProfileImage}
                                    >
                                        ×
                                    </button>
                                </>
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
                        <p className="Registerpage-optional-text">
                            (Optional)
                        </p>
                        {validationErrors.profileImage && 
                            <div className="Registerpage-error-message">{validationErrors.profileImage}</div>}
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
                                onBlur={handleBlur}
                                required
                            />
                        </div>
                        {validationErrors.username && 
                            <div className="Registerpage-error-message">{validationErrors.username}</div>}

                        <div className="Registerpage-input-row">
                            <div className="Registerpage-input-group">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
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
                                    onBlur={handleBlur}
                                    required
                                />
                            </div>
                        </div>
                        <div className="Registerpage-error-row">
                            <div className="Registerpage-error-column">
                                {validationErrors.firstName && 
                                    <div className="Registerpage-error-message">{validationErrors.firstName}</div>}
                            </div>
                            <div className="Registerpage-error-column">
                                {validationErrors.lastName && 
                                    <div className="Registerpage-error-message">{validationErrors.lastName}</div>}
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
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                required
                            />
                            <div 
                                className="Registerpage-password-toggle" 
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                        {formData.password && 
                            <div className="Registerpage-password-strength">
                                <div className="Registerpage-strength-meter">
                                    <div 
                                        className={`Registerpage-strength-bar strength-${passwordStrength}`}
                                    ></div>
                                </div>
                                <span className="Registerpage-strength-text">
                                    {getPasswordStrengthText()}
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
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                required
                            />
                            <div 
                                className="Registerpage-password-toggle" 
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
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
                                onBlur={handleBlur}
                                required
                            />
                        </div>
                        {validationErrors.address && 
                            <div className="Registerpage-error-message">{validationErrors.address}</div>}
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