import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../css/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [verificationData, setVerificationData] = useState({
    emailOtp: '',
    phoneOtp: '',
  });
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.status === 'success') {
        setUser(data.data.user);
        setEditData({
          firstName: data.data.user.firstName,
          lastName: data.data.user.lastName,
          email: data.data.user.email,
          phoneNumber: data.data.user.phoneNumber,
          address: data.data.user.address,
        });
      } else {
        toast.error('Failed to load profile');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Failed to load profile');
      navigate('/login');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVerificationChange = (e) => {
    setVerificationData({
      ...verificationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(editData).forEach(key => {
      formData.append(key, editData[key]);
    });
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.status === 'success') {
        if (editData.email !== user.email || editData.phoneNumber !== user.phoneNumber) {
          setShowVerification(true);
        } else {
          toast.success('Profile updated successfully');
          setIsEditing(false);
          fetchUserProfile();
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Update failed. Please try again.');
    }
  };

  const handleVerify = async () => {
    try {
      // Verify email if changed
      if (editData.email !== user.email) {
        const emailResponse = await fetch('http://localhost:5000/api/users/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ code: verificationData.emailOtp }),
        });
        if (!emailResponse.ok) {
          toast.error('Email verification failed');
          return;
        }
      }

      // Verify phone if changed
      if (editData.phoneNumber !== user.phoneNumber) {
        const phoneResponse = await fetch('http://localhost:5000/api/users/verify-phone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ code: verificationData.phoneOtp }),
        });
        if (!phoneResponse.ok) {
          toast.error('Phone verification failed');
          return;
        }
      }

      toast.success('Profile updated successfully');
      setShowVerification(false);
      setIsEditing(false);
      fetchUserProfile();
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/account', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        toast.success('Account deleted successfully');
        navigate('/login');
      } else {
        toast.error('Failed to delete account');
      }
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  if (!user) {
    return <div className="profile_loading">Loading...</div>;
  }

  return (
    <div className="profile_container">
      <div className="profile_card">
        {!isEditing ? (
          // View Mode
          <>
            <div className="profile_header">
              <div className="profile_image">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" />
                ) : (
                  <div className="profile_image_placeholder">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                )}
              </div>
              <h2>{`${user.firstName} ${user.lastName}`}</h2>
              <p className="profile_username">@{user.username}</p>
            </div>

            <div className="profile_info">
              <div className="profile_info_item">
                <label>Email:</label>
                <p>{user.email}</p>
              </div>
              <div className="profile_info_item">
                <label>Phone:</label>
                <p>{user.phoneNumber}</p>
              </div>
              <div className="profile_info_item">
                <label>Address:</label>
                <p>{user.address}</p>
              </div>
            </div>

            <div className="profile_actions">
              <button
                onClick={() => setIsEditing(true)}
                className="profile_edit_button"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="profile_delete_button"
              >
                Delete Account
              </button>
            </div>
          </>
        ) : (
          // Edit Mode
          <form onSubmit={handleUpdate} className="profile_edit_form">
            <div className="profile_image_upload">
              <div className="profile_image">
                {imagePreview || user.profileImage ? (
                  <img src={imagePreview || user.profileImage} alt="Profile" />
                ) : (
                  <div className="profile_image_placeholder">
                    {editData.firstName[0]}{editData.lastName[0]}
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="profile-image"
                hidden
              />
              <label htmlFor="profile-image" className="profile_upload_button">
                Change Photo
              </label>
            </div>

            <div className="profile_form_group">
              <input
                type="text"
                name="firstName"
                value={editData.firstName}
                onChange={handleEditChange}
                placeholder="First Name"
                required
              />
            </div>

            <div className="profile_form_group">
              <input
                type="text"
                name="lastName"
                value={editData.lastName}
                onChange={handleEditChange}
                placeholder="Last Name"
                required
              />
            </div>

            <div className="profile_form_group">
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
                placeholder="Email"
                required
              />
            </div>

            <div className="profile_form_group">
              <input
                type="tel"
                name="phoneNumber"
                value={editData.phoneNumber}
                onChange={handleEditChange}
                placeholder="Phone Number"
                required
              />
            </div>

            <div className="profile_form_group">
              <textarea
                name="address"
                value={editData.address}
                onChange={handleEditChange}
                placeholder="Address"
                required
              />
            </div>

            <div className="profile_edit_actions">
              <button type="submit" className="profile_save_button">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="profile_cancel_button"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Verification Modal */}
      {showVerification && (
        <div className="profile_modal">
          <div className="profile_modal_content">
            <h3>Verify Changes</h3>
            {editData.email !== user.email && (
              <div className="profile_form_group">
                <input
                  type="text"
                  name="emailOtp"
                  value={verificationData.emailOtp}
                  onChange={handleVerificationChange}
                  placeholder="Email Verification Code"
                  required
                />
              </div>
            )}
            {editData.phoneNumber !== user.phoneNumber && (
              <div className="profile_form_group">
                <input
                  type="text"
                  name="phoneOtp"
                  value={verificationData.phoneOtp}
                  onChange={handleVerificationChange}
                  placeholder="Phone Verification Code"
                  required
                />
              </div>
            )}
            <div className="profile_modal_actions">
              <button onClick={handleVerify} className="profile_verify_button">
                Verify
              </button>
              <button
                onClick={() => setShowVerification(false)}
                className="profile_cancel_button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="profile_modal">
          <div className="profile_modal_content">
            <h3>Delete Account</h3>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="profile_modal_actions">
              <button onClick={handleDelete} className="profile_delete_confirm_button">
                Yes, Delete Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="profile_cancel_button"
              >
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