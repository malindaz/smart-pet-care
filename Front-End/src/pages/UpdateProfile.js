import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../css/Profile.css';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { FaUser, FaEnvelope, FaPhone, FaHome } from "react-icons/fa";

const UpdateProfile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const fileInputRef = useRef(null);
    
    // API base URL
    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchUserData = async () => {
            const storedUser = localStorage.getItem('userData');
            if (!storedUser) {
                navigate('/login');
                return;
            }
            
            try {
                const user = JSON.parse(storedUser);
                setUserData(user);
                setFormData(user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Failed to load user data');
                navigate('/profile');
            }
        };
        
        fetchUserData();
    }, [navigate]);

    const validateField = (name, value) => {
        let errors = {...validationErrors};
        
        switch(name) {
            case 'firstName':
            case 'lastName':
                if (!value.trim()) {
                    errors[name] = `${name === 'firstName' ? 'First name' : 'Last name'} is required`;
                } else if (/\s/.test(value)) {
                    errors[name] = `${name === 'firstName' ? 'First name' : 'Last name'} cannot contain spaces`;
                } else if (!/^[a-zA-Z']+$/.test(value)) {
                    errors[name] = `${name === 'firstName' ? 'First name' : 'Last name'} can only contain letters`;
                } else if (value.length > 30) {
                    errors[name] = `${name === 'firstName' ? 'First name' : 'Last name'} cannot exceed 50 characters`;
                } else {
                    errors[name] = '';
                }
                break;
                
            case 'phoneNumber':
                if (!value.trim()) {
                    errors.phoneNumber = 'Phone number is required';
                } else if (/\s/.test(value)) {
                    errors.phoneNumber = 'Phone number cannot contain spaces';
                } else if (!/^\d+$/.test(value)) {
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const handleFileChange = (e) => {
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
            
            setFormData({ ...formData, profileImage: file });
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

    const validateForm = () => {
        // Validate all required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'address'];
        requiredFields.forEach(field => {
            validateField(field, formData[field]);
        });
        
        // Check if there are any errors
        return !Object.values(validationErrors).some(error => error !== '');
    };

    const handleUpdate = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);
        try {
            // Create FormData object for file upload
            const submitData = new FormData();
            submitData.append('userId', userData._id);
            submitData.append('firstName', formData.firstName);
            submitData.append('lastName', formData.lastName);
            submitData.append('email', formData.email);
            submitData.append('phoneNumber', formData.phoneNumber);
            submitData.append('address', formData.address || '');
            
            // Only append file if it's actually a File object (not a string path)
            if (formData.profileImage instanceof File) {
                submitData.append('profileImage', formData.profileImage);
            }
            
            const response = await axios.put(`${baseURL}/api/users/profile/update-profile`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data.success) {
                // Update localStorage with new user data
                const updatedUser = { ...response.data.user };
                localStorage.setItem('userData', JSON.stringify(updatedUser));
                
                toast.success('Profile updated successfully!');
                navigate('/profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    if (!userData) {
        return <div className="profile_loading">Loading...</div>;
    }

    if (loading) {
        return <div className="profile_loading">Processing...</div>;
    }

    return (
        <div>
            <NavBar/>
            <div className="profile_container">
                <div className="profile_card">
                    <div className="profile_header">
                        <div className="profile_image">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" />
                            ) : userData.profileImage ? (
                                <img 
                                    src={getImageUrl(userData.profileImage)} 
                                    alt="Profile" 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = "none";
                                        e.target.parentNode.innerHTML = `<div class="profile_image_placeholder">${userData.firstName[0]}${userData.lastName[0]}</div>`;
                                    }}
                                />
                            ) : (
                                <div className="profile_image_placeholder">
                                    {userData.firstName[0]}{userData.lastName[0]}
                                </div>
                            )}
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            style={{ display: 'none' }} 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <button 
                            className="profile_upload_button" 
                            onClick={() => fileInputRef.current.click()}
                        >
                            Change Photo
                        </button>
                        {validationErrors.profileImage && 
                            <div className="profile_error_message">{validationErrors.profileImage}</div>}
                        <h2>{userData.firstName} {userData.lastName}</h2>
                        <p className="profile_username">@{userData.username}</p>
                    </div>

                    <div className="profile_info">
                        <div className="profile_edit_form">
                            <div className="profile_input_row">
                                <div>
                                    <div className="profile_edit_field">
                                        <div className="profile_input_icon">
                                            <FaUser />
                                        </div>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName || ''}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className="profile_input"
                                            placeholder="First Name"
                                        />
                                    </div>
                                    {validationErrors.firstName && 
                                        <div className="profile_error_message">{validationErrors.firstName}</div>}
                                </div>
                                
                                <div>
                                    <div className="profile_edit_field">
                                        <div className="profile_input_icon">
                                            <FaUser />
                                        </div>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName || ''}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className="profile_input"
                                            placeholder="Last Name"
                                        />
                                    </div>
                                    {validationErrors.lastName && 
                                        <div className="profile_error_message">{validationErrors.lastName}</div>}
                                </div>
                            </div>

                            <div>
                                <div className="profile_edit_field">
                                    <div className="profile_input_icon">
                                        <FaEnvelope />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className="profile_input"
                                        placeholder="Email"
                                    />
                                </div>
                                {validationErrors.email && 
                                    <div className="profile_error_message">{validationErrors.email}</div>}
                            </div>

                            <div>
                                <div className="profile_edit_field">
                                    <div className="profile_input_icon">
                                        <FaPhone />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber || ''}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className="profile_input"
                                        placeholder="Phone Number"
                                    />
                                </div>
                                {validationErrors.phoneNumber && 
                                    <div className="profile_error_message">{validationErrors.phoneNumber}</div>}
                            </div>

                            <div>
                                <div className="profile_edit_field">
                                    <div className="profile_input_icon">
                                        <FaHome />
                                    </div>
                                    <textarea
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className="profile_input"
                                        placeholder="Address"
                                    />
                                </div>
                                {validationErrors.address && 
                                    <div className="profile_error_message">{validationErrors.address}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="profile_actions">
                        <div className="profile_edit_actions">
                            <button className="profile_save_button" onClick={handleUpdate} disabled={loading}>
                                <i className="fas fa-check"></i>
                                Save Changes
                            </button>
                            <button className="profile_cancel_button" onClick={handleCancel}>
                                <i className="fas fa-times"></i>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

// Function to get the correct image URL
const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    // Remove the leading slash if it exists
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `http://localhost:5000/${cleanPath}`;
};

export default UpdateProfile; 