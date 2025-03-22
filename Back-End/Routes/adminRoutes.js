const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const { protect } = require('../Middleware/authMiddleware');

router.get(
  '/requests', adminController.getAllVeterinarianRequests
);

router.put(
  '/update-status', adminController.updateVeterinarianStatus
);

module.exports = router;