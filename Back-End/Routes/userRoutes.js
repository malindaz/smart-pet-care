const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUser,
    sendEmailVerification,
    sendPhoneVerification,
    verifyEmail,
    verifyPhone
} = require('../Controllers/userController');
const { protect } = require('../Middleware/authMiddleware');
const upload = require('../Middleware/uploadMiddleware');

// Public routes
router.post('/register', upload.single('profileImage'), registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.post('/verify-phone', verifyPhone);
router.post('/send-email-verification', sendEmailVerification);
router.post('/send-phone-verification', sendPhoneVerification);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('profileImage'), updateUserProfile);
router.delete('/profile', protect, deleteUser);

module.exports = router;
