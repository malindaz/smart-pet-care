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
        const userUpdated = await User.findOneAndUpdate(
          { email: vetRequest.email },
          { userLevel: 2 },
          { new: true }
        );
        
        if (!userUpdated) {
          console.log(`User with email ${vetRequest.email} not found`);
          return res.status(404).json({
            success: false,
            error: 'User associated with this veterinarian request not found'
          });
        }
        
        console.log(`User ${userUpdated.email} updated to level 2`);
      } catch (userError) {
        console.error('Error updating user level:', userError);
        return res.status(500).json({ 
          success: false, 
          error: 'Error updating user level', 
          details: userError.message 
        });
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