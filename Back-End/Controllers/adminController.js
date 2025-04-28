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

// Update veterinarian request status
exports.updateVeterinarianStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    
    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid request parameters' });
    }
    
    const vetRequest = await Veterinarian.findById(id);
    
    if (!vetRequest) {
      return res.status(404).json({ success: false, error: 'Veterinarian request not found' });
    }
    
    // Update vet request status
    vetRequest.status = status;
    vetRequest.updatedAt = Date.now();
    await vetRequest.save();
    
    // If approved, update user level from 4 to 2
    if (status === 'approved') {
      try {
        // Make sure you're querying for the user with the correct field
        // Assuming email is the common field between Veterinarian and User
        const user = await User.findOne({ email: vetRequest.email });
        
        if (!user) {
          console.log(`User with email ${vetRequest.email} not found`);
          // Continue even if user not found - don't return early
          console.error('User associated with this veterinarian request not found');
        } else {
          // Update user level
          user.userLevel = 2;
          await user.save();
          console.log(`User ${user.email} updated to level 2`);
        }
      } catch (userError) {
        console.error('Error updating user level:', userError);
        // Continue with the response even if there's an error updating the user
      }
    }
    
    res.status(200).json({
      success: true,
      data: vetRequest,
      message: `Veterinarian request ${status}`
    });
    
  } catch (error) {
    console.error('Error updating veterinarian status:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
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