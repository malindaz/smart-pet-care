const User = require('../Models/User');
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

        const userLevel = 4; // Default to normal user
        
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
            userLevel
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

// @desc    Update user profile
// @route   PUT /api/users/profile/update-profile
// @access  Public
const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID is required' 
            });
        }

        // Validate required fields
        const { firstName, lastName, email, phoneNumber } = req.body;
        if (!firstName || !lastName || !email || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Check if email is being changed and if it's already taken
        if (email !== user.email) {
            const emailExists = await User.findOne({ email, _id: { $ne: userId } });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
        }
        
        // Update user fields
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.address = req.body.address || user.address;
        
        // Update password if provided
        if (req.body.password) {
            user.password = req.body.password;
        }
        
        // Handle profile image update
        if (req.file) {
            // Delete old profile image if exists
            if (user.profileImage) {
                try {
                    const oldImagePath = path.join(__dirname, '../public', user.profileImage);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                } catch (err) {
                    console.error('Error deleting old profile image:', err);
                }
            }
            
            // Set new profile image path
            user.profileImage = `/uploads/profiles/${req.file.filename}`;
        }
        
        // Save updated user
        const updatedUser = await user.save();
        
        // Exclude password from response
        const userData = {
            _id: updatedUser._id,
            username: updatedUser.username,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
            address: updatedUser.address,
            profileImage: updatedUser.profileImage,
            userLevel: updatedUser.userLevel
        };
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: userData
        });
    } catch (error) {
        console.error('Profile update error:', error);
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                success: false, 
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} already taken` 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Server error updating profile' 
        });
    }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Public
const deleteUser = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Delete profile image if exists
        if (user.profileImage) {
            try {
                const imagePath = path.join(__dirname, '../public', user.profileImage);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (err) {
                console.error('Error deleting profile image:', err);
            }
        }
        
        // Delete user from database
        await User.deleteOne({ _id: user._id });
        
        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Account deletion error:', error);
        res.status(500).json({ success: false, message: 'Server error deleting account' });
    }
};

const logout = async (req, res) => {
    try {
      // If you're using sessions or have a token blacklist
      // You can invalidate the session or add the token to a blacklist here
      
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred during logout'
      });
    }
  };


module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUser,
    logout
};


