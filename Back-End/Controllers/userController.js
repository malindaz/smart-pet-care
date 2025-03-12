const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { sendVerificationEmail } = require('../utils/emailService');
const { sendVerificationSMS } = require('../utils/smsService');

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function(req, file, cb) {
    cb(null, `user-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image file (jpg, jpeg, png)'));
    }
    cb(null, true);
  }
}).single('profileImage');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register User
const registerUser = async (req, res) => {
    try {
        const {
            username,
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            address
        } = req.body;

        const userExists = await User.findOne({
            $or: [{ email }, { username }, { phoneNumber }]
        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const profileImage = req.file ? req.file.path : '';

        const user = await User.create({
            username,
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            address,
            profileImage
        });

        if (user) {
            res.status(201).json({
                success: true,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    token: generateToken(user._id)
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Send Email Verification Code
const sendEmailVerification = async (req, res) => {
    try {
        const { email } = req.body;
        const code = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.emailVerificationCode = { code, expiresAt };
        await user.save();

        const sent = await sendVerificationEmail(email, code);
        if (sent) {
            res.json({
                success: true,
                message: 'Verification code sent to email'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send verification code'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Send Phone Verification Code
const sendPhoneVerification = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const code = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.phoneVerificationCode = { code, expiresAt };
        await user.save();

        const sent = await sendVerificationSMS(phoneNumber, code);
        if (sent) {
            res.json({
                success: true,
                message: 'Verification code sent to phone'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send verification code'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Verify Email
const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.emailVerificationCode || 
            user.emailVerificationCode.code !== code ||
            user.emailVerificationCode.expiresAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification code'
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationCode = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Verify Phone
const verifyPhone = async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.phoneVerificationCode || 
            user.phoneVerificationCode.code !== code ||
            user.phoneVerificationCode.expiresAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification code'
            });
        }

        user.isPhoneVerified = true;
        user.phoneVerificationCode = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Phone number verified successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { login, password } = req.body; // login can be username or email

        const user = await User.findOne({
            $or: [{ email: login }, { username: login }]
        });

        if (user && (await user.comparePassword(password))) {
            res.json({
                success: true,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json({
                success: true,
                user
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = req.body.username || user.username;
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.address = req.body.address || user.address;

            if (req.file) {
                user.profileImage = req.file.path;
            }

            if (req.body.email && req.body.email !== user.email) {
                user.email = req.body.email;
                user.isEmailVerified = false;
            }

            if (req.body.phoneNumber && req.body.phoneNumber !== user.phoneNumber) {
                user.phoneNumber = req.body.phoneNumber;
                user.isPhoneVerified = false;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                user: {
                    _id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    token: generateToken(updatedUser._id)
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete User Account
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            await user.remove();
            res.json({
                success: true,
                message: 'User account deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUser,
    sendEmailVerification,
    sendPhoneVerification,
    verifyEmail,
    verifyPhone
};
