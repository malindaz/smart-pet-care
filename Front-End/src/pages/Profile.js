import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../css/Profile.css';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    
    // API base URL - adjust this to match your server
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
                // If we have a token, try to get fresh data from the server
                if (user.token) {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    };
                    
                    const response = await axios.get(`${baseURL}/api/users/profile`, config);
                    if (response.data.success) {
                        const updatedUser = { ...response.data.user, token: user.token };
                        localStorage.setItem('userData', JSON.stringify(updatedUser));
                        setUserData(updatedUser);
                        setFormData(updatedUser);
                        return;
                    }
                }
                
                // If we couldn't get fresh data, use what we have in localStorage
                setUserData(user);
                setFormData(user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Use stored data if fetch fails
                const user = JSON.parse(storedUser);
                setUserData(user);
                setFormData(user);
            }
        };
        
        fetchUserData();
    }, [navigate, baseURL]);

    useEffect(() => {
        console.log('User Data:', userData);
        if (userData?.profileImage) {
            console.log('Profile Image Path:', getImageUrl(userData.profileImage));
        }
    }, [userData]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profileImage: file });
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const token = userData.token;
            if (!token) {
                toast.error('Authentication required');
                return;
            }
            
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };
            
            // Create FormData object for file upload
            const submitData = new FormData();
            submitData.append('firstName', formData.firstName);
            submitData.append('lastName', formData.lastName);
            submitData.append('email', formData.email);
            submitData.append('phoneNumber', formData.phoneNumber);
            submitData.append('address', formData.address);
            
            // Only append file if it's actually a File object (not a string path)
            if (formData.profileImage instanceof File) {
                submitData.append('profileImage', formData.profileImage);
            }
            
            const response = await axios.put(`${baseURL}/api/users/profile`, submitData, config);
            
            if (response.data.success) {
                // Update localStorage with new user data
                const updatedUser = { ...response.data.user, token };
                localStorage.setItem('userData', JSON.stringify(updatedUser));
                
                setUserData(updatedUser);
                setFormData(updatedUser);
                setImagePreview(null);
                setIsEditing(false);
                toast.success('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const token = userData.token;
            if (!token) {
                toast.error('Authentication required');
                return;
            }
            
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            
            const response = await axios.delete(`${baseURL}/api/users/profile`, config);
            
            if (response.data.success) {
                localStorage.removeItem('userData');
                navigate('/signup');
                toast.success('Account deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error(error.response?.data?.message || 'Failed to delete account');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setFormData(userData);
        setImagePreview(null);
        setIsEditing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('userData');
        navigate('/login');
        toast.success('Logged out successfully!');
    };

    // Function to get the correct image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        // Remove the leading slash if it exists
        const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        return `http://localhost:5000/${cleanPath}`;
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
                            {isEditing ? (
                                <>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" />
                                    ) : userData.profileImage ? (
                                        <img 
                                            src={getImageUrl(userData.profileImage)} 
                                            alt="Profile" 
                                            onError={(e) => {
                                                console.error("Image failed to load:", userData.profileImage);
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
                                </>
                            ) : userData.profileImage ? (
                                <img 
                                    src={getImageUrl(userData.profileImage)} 
                                    alt="Profile" 
                                    onError={(e) => {
                                        console.error("Image failed to load:", userData.profileImage);
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
                        <h2>{userData.firstName} {userData.lastName}</h2>
                        <p className="profile_username">@{userData.username}</p>
                    </div>

                    <div className="profile_info">
                        <div className="profile_info_item">
                            <label>Email</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{userData.email}</p>
                            )}
                        </div>
                        <div className="profile_info_item">
                            <label>Phone Number</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{userData.phoneNumber}</p>
                            )}
                        </div>
                        <div className="profile_info_item">
                            <label>Address</label>
                            {isEditing ? (
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{userData.address}</p>
                            )}
                        </div>
                    </div>

                    <div className="profile_actions">
                        {isEditing ? (
                            <>
                                <button className="profile_save_button" onClick={handleUpdate}>Save Changes</button>
                                <button className="profile_cancel_button" onClick={handleCancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button className="profile_edit_button" onClick={() => setIsEditing(true)}>Edit Profile</button>
                                <button className="profile_delete_button" onClick={handleDelete}>Delete Account</button>
                                <button className="profile_logout_button" onClick={handleLogout}>Logout</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
           <Footer/> 
        </div>
    );
};

export default Profile;