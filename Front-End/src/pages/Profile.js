import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../css/Profile.css';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    
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
                setUserData(user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Failed to load user data');
            }
        };
        
        fetchUserData();
    }, [navigate]);

    const handleDelete = async () => {
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(`${baseURL}/api/users/profile`, {
                data: { email: userData.email }
            });
            
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
            setShowDeleteConfirmation(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
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
                            {userData.profileImage ? (
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
                            <label>Full Name</label>
                            <p>{userData.firstName} {userData.lastName}</p>
                        </div>
                        <div className="profile_info_item">
                            <label>Email</label>
                            <p>{userData.email}</p>
                        </div>
                        <div className="profile_info_item">
                            <label>Phone Number</label>
                            <p>{userData.phoneNumber}</p>
                        </div>
                        <div className="profile_info_item">
                            <label>Address</label>
                            <p>{userData.address}</p>
                        </div>
                    </div>

                    <div className="profile_actions">
                        <div className="profile_view_actions">
                            <button className="profile_edit_button" onClick={() => navigate('/update-profile')}>
                                <i className="fas fa-edit"></i>
                                Edit Profile
                            </button>
                            <button className="profile_delete_button" onClick={handleDelete}>
                                <i className="fas fa-trash-alt"></i>
                                Delete Account
                            </button>
                            <button className="profile_logout_button" onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt"></i>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirmation && (
                <div className="delete_confirmation_dialog">
                    <div className="delete_confirmation_content">
                        <h3>Delete Account</h3>
                        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                        <div className="delete_confirmation_buttons">
                            <button className="delete_confirm_button" onClick={confirmDelete}>
                                Delete Account
                            </button>
                            <button className="delete_cancel_button" onClick={cancelDelete}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;