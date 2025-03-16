<<<<<<< HEAD
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { username, firstName, lastName, email, phoneNumber, password, address} = req.body;
        
        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }, { phoneNumber }] });
        
        if (userExists) {
            // Remove uploaded file if exists
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            
            if (userExists.email === email) {
                return res.status(400).json({ success: false, message: 'Email already registered' });
            } else if (userExists.username === username) {
                return res.status(400).json({ success: false, message: 'Username already taken' });
            } else if (userExists.phoneNumber === phoneNumber) {
                return res.status(400).json({ success: false, message: 'Phone number already registered' });
            }
        }
        
        // Create user object
        const userToCreate = {
            username,
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            address,
            userLevel: 4 // Default to normal user
        };
        
        // Add profile image if uploaded
        if (req.file) {
            userToCreate.profileImage = `/uploads/profiles/${req.file.filename}`;
        }
        
        const user = await User.create(userToCreate);
        
        if (user) {
            // Generate token
            const token = generateToken(user._id);
            
            // Exclude password from response
            const userData = {
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
                profileImage: user.profileImage,
                userLevel: user.userLevel
            };
            
            res.status(201).json({
                success: true,
                token,
                user: userData
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        
        if (user && (await user.matchPassword(password))) {
            // Generate token
            const token = generateToken(user._id);
            
            // Exclude password from response
            const userData = {
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
                profileImage: user.profileImage,
                userLevel: user.userLevel
            };
            
            res.json({
                success: true,
                token,
                user: userData
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (user) {
            res.json({
                success: true,
                user
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching profile' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};
=======
>>>>>>> a40411dd45814b4005eec4aa34f30b85a0a77943
