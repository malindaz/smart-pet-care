const express = require('express');
const multer = require('multer');
const { check } = require('express-validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../Controllers/pharmacyController');

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Serve images statically
router.use('/uploads', express.static('uploads'));


// Get all products
router.get('/', getProducts);

// Get product by ID
router.get('/:id', getProductById);

// Create a new product (with validation & image upload)
router.post(
  '/',
  upload.single('image'),
  [
    check('category', 'Category is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price must be a number').isNumeric(),
    check('description', 'Description is required').not().isEmpty(),
  ],
  createProduct
);

// Update a product (with optional image upload)
router.put('/:id', upload.single('image'), updateProduct);

// Delete a product by ID
router.delete('/:id', deleteProduct);

module.exports = router;
