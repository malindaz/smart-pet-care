import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../css/Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const storedUser = localStorage.getItem('userData');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        const user = JSON.parse(storedUser);
        setUserData(user);
        setFormData(user);
    }, [navigate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        // Update user data in the backend and localStorage
        localStorage.setItem('userData', JSON.stringify(formData));
        setUserData(formData);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
    };

    const handleDelete = () => {
        // Delete user data from the backend and localStorage
        localStorage.removeItem('userData');
        navigate('/register');
        toast.success('Account deleted successfully!');
    };

    if (!userData) {
        return <div className="profile_loading">Loading...</div>;
    }

    return (
        <div className="profile_container">
            <div className="profile_card">
                <div className="profile_header">
                    <div className="profile_image">
                        {userData.profileImage ? (
                            <img src={userData.profileImage} alt="Profile" />
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
                        <button className="profile_save_button" onClick={handleUpdate}>Save</button>
                    ) : (
                        <button className="profile_edit_button" onClick={() => setIsEditing(true)}>Edit Profile</button>
                    )}
                    <button className="profile_delete_button" onClick={handleDelete}>Delete Account</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;