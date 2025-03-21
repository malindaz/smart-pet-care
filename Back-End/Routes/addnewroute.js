const express = require('express');
const router = express.Router();
const petController = require('../Controllers/addnewpetcontroller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Ensure the uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only PNG, JPG, and JPEG files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// ✅ Define routes with `upload.single('photo')` for file uploads
router.post('/add', upload.single('photo'), petController.addPet);
router.get('/all', petController.getAllPets);
router.get('/:id', petController.getPetById);
router.delete('/:id', petController.deletePet);
router.put('/:petId', upload.single('photo'), petController.updatePet); // ✅ Fix applied here

module.exports = router;
