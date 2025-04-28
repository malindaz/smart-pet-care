const Veterinarian = require('../Models/Veterinarian');

const User = require('../Models/User');
const Pharmacy = require('../Models/PharmacyRegistModel');


// Get all veterinarian requests
exports.getAllVeterinarianRequests = async (req, res) => {
  try {
    const vetRequests = await Veterinarian.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: vetRequests });
  } catch (error) {
    console.error('Error fetching veterinarian requests:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

;
// vet request appoves by admin
exports.updateVetRequestStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        success: false,
        error: 'Request ID and status are required'
      });
    }

    // Valid status values
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value. Must be pending, approved, or rejected.'
      });
    }

    // Find the vet request - using the Veterinarian model instead of VetRequest
    const vetRequest = await Veterinarian.findById(id);

    if (!vetRequest) {
      return res.status(404).json({
        success: false,
        error: 'Veterinarian request not found'
      });
    }

    // Update the vet request status
    vetRequest.status = status;
    await vetRequest.save();

    // If the request is approved, upgrade the user's level from 4 to 2
    if (status === 'approved') {
      
      const user = await User.findOne({ email: vetRequest.email });
      
      if (!user) {
        return res.status(200).json({
          success: true,
          warning: 'Vet request status updated, but user account not found',
          data: vetRequest
        });
      }

      // Update user level
      if (user.userLevel === 4) {
        user.userLevel = 2;
        await user.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: `Veterinarian request ${status} successfully`,
      data: vetRequest
    });

  } catch (error) {
    console.error('Error updating vet request status:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error when updating veterinarian request status'
    });
  }
};


// Get all pharmacy requests
exports.getAllPharmacyRequests = async (req, res) => {
  try {
    const pharmacyRequests = await Pharmacy.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.status(200).json({
      success: true,
      count: pharmacyRequests.length,
      data: pharmacyRequests
    });
  } catch (error) {
    console.error('Error fetching pharmacy requests:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update pharmacy status
exports.updatePharmacyStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request parameters'
      });
    }

    const pharmacyRequest = await Pharmacy.findById(id);

    if (!pharmacyRequest) {
      return res.status(404).json({
        success: false,
        error: 'Pharmacy request not found'
      });
    }

    pharmacyRequest.status = status;
    pharmacyRequest.updatedAt = Date.now();
    await pharmacyRequest.save();

    if (status === 'approved') {
      const user = await User.findOne({ email: pharmacyRequest.email });
      if (user) {
        user.userLevel = 3; // Update to pharmacy level
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      data: pharmacyRequest,
      message: `Pharmacy request ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating pharmacy status:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userLevel } = req.body;
    
    if (!userLevel || ![1, 2, 3, 4].includes(userLevel)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user level'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { userLevel },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

