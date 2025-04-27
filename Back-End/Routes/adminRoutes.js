const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const { protect } = require('../Middleware/authMiddleware');

router.get(
  '/requests', adminController.getAllVeterinarianRequests
);


// Update veterinarian request status (approve/reject)
router.put('/update-status', adminController.updateVetRequestStatus);


module.exports = router;