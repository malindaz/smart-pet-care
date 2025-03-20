const express = require('express');
const router = express.Router();
const petController = require('../controllers/addnewpetcontroller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');



const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

//  Allow Only PNG, JPG, JPEG
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only PNG, JPG, and JPEG files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: fileFilter,
});

module.exports = upload;



// Use Multer middleware for file upload
router.post("/add", upload.single("photo"), petController.addPet);



// Corrected Routes
router.post('/add', upload.single('photo'), petController.addPet);  // Ensure file upload works
router.get('/all', petController.getAllPets);
router.get('/:id', petController.getPetById);
router.delete("/:id", petController.deletePet);
router.put('/:petId', petController.updatePet);

module.exports = router;
