const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  applyPharmacy, 
  getAllPharmacyRegistrations, 
  updatePharmacyStatus 
} = require('../Controllers/PharmacyRegistController');

// Ensure directories exist
const uploadDir = path.join(__dirname, '../uploads');
const pharmacyDocumentsDir = path.join(uploadDir, 'pharmacy-documents');
const pharmacyProfileImagesDir = path.join(uploadDir, 'pharmacy-profile-images');

// Create directories if they don't exist
[uploadDir, pharmacyDocumentsDir, pharmacyProfileImagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    switch(file.fieldname) {
      case 'businessRegistrationDocument':
      case 'pharmacyLicenseDocument':
        cb(null, pharmacyDocumentsDir);
        break;
      case 'profileImage':
        cb(null, pharmacyProfileImagesDir);
        break;
      default:
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
  const documentTypes = [
    'image/jpeg', 
    'image/png', 
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (file.fieldname === 'profileImage') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for profile picture!'), false);
    }
  } else if (['businessRegistrationDocument', 'pharmacyLicenseDocument'].includes(file.fieldname)) {
    if (documentTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid document type for registration documents!'), false);
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

// Pharmacy registration routes
router.post('/apply', upload.fields([
  { name: 'businessRegistrationDocument', maxCount: 1 },
  { name: 'pharmacyLicenseDocument', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 }
]), applyPharmacy);

// Admin routes for pharmacy registrations
router.get('/registrations', getAllPharmacyRegistrations);
router.put('/update-status', updatePharmacyStatus);

module.exports = router;