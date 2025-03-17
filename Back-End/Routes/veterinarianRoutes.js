// routes/veterinarianRoutes.js
const express = require('express');
const router = express.Router();
const veterinarianController = require('../Controllers/veterinarianController');
const authMiddleware = require('../Middleware/authMiddleware');

// Public route for veterinarian application
router.post('/apply', veterinarianController.applyVeterinarian);


module.exports = router;