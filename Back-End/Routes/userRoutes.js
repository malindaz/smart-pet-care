const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUser } = require('../Controllers/userController');
const { protect } = require('../Middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../public/uploads/profiles');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, 'profile-' + uniqueSuffix + extension);
    }
});

// Create multer upload instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Middleware to process uploaded files and modify the path for DB storage
const processUploadedFile = (req, res, next) => {
    if (req.file) {
        // Convert the absolute path to a relative path for storage in DB
        // Extract just the relative path from public folder
        const relativePath = '/uploads/profiles/' + path.basename(req.file.path);
        req.file.storagePath = relativePath;
    }
    next();
};

// Add error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success: false, 
                message: 'File size too large. Maximum size is 5MB.' 
            });
        }
    }
    next(err);
};

// Routes
router.post('/register', upload.single('profileImage'),handleMulterError, processUploadedFile, registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('profileImage'),handleMulterError, processUploadedFile, updateUserProfile);
router.delete('/profile', protect, deleteUser);

// Add a route to serve profile images (as a fallback if static middleware isn't configured properly)
router.get('/uploads/profiles/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../public/uploads/profiles', req.params.filename);
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }
    return res.status(404).json({ message: 'Image not found' });
});

module.exports = router;