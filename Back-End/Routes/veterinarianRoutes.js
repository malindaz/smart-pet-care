const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { applyVeterinarian } = require('../Controllers/veterinarianController');

// Ensure directories exist
const uploadDir = path.join(__dirname, '../uploads');
const profileImagesDir = path.join(uploadDir, 'profile-images');
const licenseDocumentsDir = path.join(uploadDir, 'license-documents');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(profileImagesDir)) {
  fs.mkdirSync(profileImagesDir);
}
if (!fs.existsSync(licenseDocumentsDir)) {
  fs.mkdirSync(licenseDocumentsDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'profileImage') {
      cb(null, profileImagesDir);
    } else if (file.fieldname === 'licenseCopy') {
      cb(null, licenseDocumentsDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'profileImage') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for profile picture!'), false);
    }
  } else if (file.fieldname === 'licenseCopy') {
    if (file.mimetype.startsWith('image/') || 
        file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only image, PDF, or Word documents allowed for license!'), false);
    }
  } else {
    cb(null, true);
  }
};

// Create multer upload instance
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

// Apply route with file upload middleware
router.post('/apply', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'licenseCopy', maxCount: 1 }
]), applyVeterinarian);

module.exports = router;