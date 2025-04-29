const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');

const { protect } = require('../Middleware/authMiddleware');

router.get(
  '/requests', adminController.getAllVeterinarianRequests
);


// Update veterinarian request status (approve/reject)
router.put('/update-status', adminController.updateVetRequestStatus);


// Add new pharmacy routes
router.get(
  '/pharmacy-requests', adminController.getAllPharmacyRequests
);

router.put(
  '/update-pharmacy-status', adminController.updatePharmacyStatus
);

// User management routes
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;