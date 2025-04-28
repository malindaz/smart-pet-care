const Veterinarian = require('../Models/Veterinarian');
const User = require('../Models/User');

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
