import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [newImage, setNewImage] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.get('http://localhost:5000/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setUser(response.data.user);
                setEditData(response.data.user);
            }
        } catch (error) {
            toast.error('Failed to fetch profile');
            if (error.response?.status === 401) {
                localStorage.removeItem('userToken');
                navigate('/login');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
            setEditData(prev => ({
                ...prev,
                profileImage: URL.createObjectURL(file)
            }));
        }
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const formData = new FormData();

            Object.keys(editData).forEach(key => {
                if (key !== 'profileImage') {
                    formData.append(key, editData[key]);
                }
            });

            if (newImage) {
                formData.append('profileImage', newImage);
            }

            const response = await axios.put(
                'http://localhost:5000/api/users/profile',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Profile updated successfully');
                setUser(response.data.user);
                setIsEditing(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.delete(
                'http://localhost:5000/api/users/profile',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                toast.success('Account deleted successfully');
                localStorage.removeItem('userToken');
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete account');
        }
    };

    const getInitials = () => {
        return user
            ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
            : '';
    };

    if (!user) {
        return <div className="profile_loading">Loading...</div>;
    }

    return (
        <div className="profile_container">
            {!isEditing ? (
                <div className="profile_view">
                    <div className="profile_header">
                        <div className="profile_image">
                            {user.profileImage ? (
                                <img src={user.profileImage} alt="Profile" />
                            ) : (
                                <div className="profile_initials">{getInitials()}</div>
                            )}
                        </div>
                        <h2>{`${user.firstName} ${user.lastName}`}</h2>
                    </div>
                    <div className="profile_details">
                        <div className="detail_item">
                            <label>Username:</label>
                            <span>{user.username}</span>
                        </div>
                        <div className="detail_item">
                            <label>Email:</label>
                            <span>{user.email}</span>
                        </div>
                        <div className="detail_item">
                            <label>Phone:</label>
                            <span>{user.phoneNumber}</span>
                        </div>
                        <div className="detail_item">
                            <label>Address:</label>
                            <span>{user.address}</span>
                        </div>
                    </div>
                    <div className="profile_actions">
                        <button onClick={() => setIsEditing(true)} className="edit_button">
                            Update Profile
                        </button>
                        <button 
                            onClick={() => setShowDeleteConfirm(true)} 
                            className="delete_button"
                        >
                            Remove Account
                        </button>
                    </div>
                </div>
            ) : (
                <div className="profile_edit">
                    <h2>Edit Profile</h2>
                    <div className="profile_image_edit">
                        {editData.profileImage ? (
                            <img src={editData.profileImage} alt="Profile" />
                        ) : (
                            <div className="profile_initials">{getInitials()}</div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="image_input"
                        />
                    </div>
                    <div className="form_group">
                        <input
                            type="text"
                            name="firstName"
                            value={editData.firstName}
                            onChange={handleInputChange}
                            placeholder="First Name"
                        />
                    </div>
                    <div className="form_group">
                        <input
                            type="text"
                            name="lastName"
                            value={editData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                        />
                    </div>
                    <div className="form_group">
                        <input
                            type="email"
                            name="email"
                            value={editData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                        />
                    </div>
                    <div className="form_group">
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={editData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="Phone Number"
                        />
                    </div>
                    <div className="form_group">
                        <textarea
                            name="address"
                            value={editData.address}
                            onChange={handleInputChange}
                            placeholder="Address"
                        />
                    </div>
                    <div className="edit_actions">
                        <button onClick={() => setIsEditing(false)} className="cancel_button">
                            Cancel
                        </button>
                        <button onClick={handleUpdate} className="save_button">
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="delete_confirmation">
                    <div className="confirmation_content">
                        <h3>Are you sure?</h3>
                        <p>This action cannot be undone.</p>
                        <div className="confirmation_actions">
                            <button 
                                onClick={() => setShowDeleteConfirm(false)}
                                className="cancel_button"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="confirm_delete_button"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile; 