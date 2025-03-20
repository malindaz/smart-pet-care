const express = require('express');
const router = express.Router();
const petController = require('../controllers/addnewpetcontroller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');



const uploadDir = "uploads/";
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});



// Use Multer middleware for file upload
router.post("/add", upload.single("photo"), petController.addPet);



// Corrected Routes
router.post('/add', upload.single('photo'), petController.addPet);  // Ensure file upload works
router.get('/all', petController.getAllPets);
router.get('/:id', petController.getPetById);
router.delete('/:id', petController.deletePet);
router.put('/:petId', petController.updatePet);

module.exports = router;
