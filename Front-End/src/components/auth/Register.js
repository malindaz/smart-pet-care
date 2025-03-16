import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CgSpinner } from "react-icons/cg";
import axios from 'axios';
import "../../css/Register.css"

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
        userLevel: 4,
        profileImage: null
    });

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
            
            // Explicitly add each field to FormData
            formDataObj.append('username', formData.username);
            formDataObj.append('firstName', formData.firstName);
            formDataObj.append('lastName', formData.lastName);
            formDataObj.append('email', formData.email);
            formDataObj.append('phoneNumber', formData.phoneNumber);
            formDataObj.append('password', formData.password);
            formDataObj.append('address', formData.address);
            formDataObj.append('userLevel', formData.userLevel);
            
            // Add profile image if exists
            if (formData.profileImage) {
                formDataObj.append('profileImage', formData.profileImage);
            }
    
            // Debugging: Log the FormData object
            for (let pair of formDataObj.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
    
            const response = await axios.post('http://localhost:5000/api/users/register', formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (response.data.success) {
                // Save token and user data
                // localStorage.setItem('userToken', response.data.token);
                // localStorage.setItem('userData', JSON.stringify(response.data.user));
                
                toast.success('Registration successful!');
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration Error:', error);
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register_container">
            <div className="register_form_container">
                <h2>Create Account</h2>
                <form className="register_form" onSubmit={handleSubmit}>
                    <div className="register_image_upload">
                        <div className="register_image_preview">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile Preview" />
                            ) : (
                                <div className="register_image_placeholder">
                                    {formData.firstName && formData.lastName ? 
                                        `${formData.firstName[0]}${formData.lastName[0]}` : 
                                        'Upload Image'}
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            id="profileImage"
                            name="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="register_file_input"
                        />
                        <label htmlFor="profileImage" className="register_upload_button">
                            Choose Profile Picture
                        </label>
                    </div>

                    <div className="register_form_group">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                    <div className="register_form_row">
                       
                        <div className="register_form_group">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="register_form_group">
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

                    

                    <div className="register_form_group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="register_form_group">
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="register_form_group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="register_form_group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="register_form_group">
                        <textarea
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <button type="submit" className="register_submit_button" disabled={loading}>
                        {loading ? <CgSpinner className="register_spinner" /> : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;