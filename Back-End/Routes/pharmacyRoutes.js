const express = require('express');
const { check } = require('express-validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../Controllers/pharmacyController');

const router = express.Router();

// Get all products
router.get('/', getProducts);

// Get product by ID
router.get('/:id', getProductById);

// Create new product (Validation: All fields are required)
router.post(
  '/',
  [
    check('category', 'Category is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price must be a number').isNumeric(),
    check('description', 'Description is required').not().isEmpty(),
  ],
  createProduct
);

// Update product by ID
router.put('/:id', updateProduct);

// Delete product by ID
router.delete('/:id', deleteProduct);

module.exports = router;
