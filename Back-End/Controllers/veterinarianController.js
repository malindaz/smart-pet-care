const Veterinarian = require('../Models/Veterinarian');
const path = require('path');

// Apply to become a veterinarian
exports.applyVeterinarian = async (req, res) => {
  try {
    
    const {
      firstName, lastName, email, phone,
      licenseNumber, licenseIssuingAuthority, licenseExpiryDate,
      specialization, yearsOfExperience,
      clinicName, clinicAddress, city, state, zipCode,
      availableTimeStart, availableTimeEnd,
      emergencyServices, homeVisits, bio, agreeToTerms
    } = req.body;

    // Check if files were uploaded
    if (!req.files || !req.files.profileImage || !req.files.licenseCopy) {
      return res.status(400).json({ 
        success: false,
        message: 'Profile image and license copy are required' 
      });
    }

    // Parse JSON strings from form data safely
    let education = [];
    try {
      education = req.body.education ? JSON.parse(req.body.education) : [];
    } catch (error) {
      console.error('Error parsing education:', error);
      education = [];
    }

    let additionalCertifications = [];
    try {
      additionalCertifications = req.body.additionalCertifications 
        ? JSON.parse(req.body.additionalCertifications) 
        : [];
    } catch (error) {
      console.error('Error parsing additionalCertifications:', error);
      additionalCertifications = [];
    }

    let parsedAvailableDays = [];
    try {
      parsedAvailableDays = req.body.availableDays
        ? JSON.parse(req.body.availableDays)
        : [];
    } catch (error) {
      console.error('Error parsing availableDays:', error);
      parsedAvailableDays = [];
    }

    // Get file paths
    const profileImageFile = req.files.profileImage[0];
    const licenseCopyFile = req.files.licenseCopy[0];

    
    const profileImagePath = `/uploads/profile-images/${path.basename(profileImageFile.path)}`;
    const licenseCopyPath = `/uploads/license-documents/${path.basename(licenseCopyFile.path)}`;

    
    const newVeterinarian = new Veterinarian({
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      phone: phone || '',
      licenseNumber: licenseNumber || '',
      licenseIssuingAuthority: licenseIssuingAuthority || '',
      licenseExpiryDate: licenseExpiryDate || new Date(),
      specialization: specialization || '',
      yearsOfExperience: Number(yearsOfExperience) || 0,
      education: education,
      additionalCertifications: additionalCertifications,
      clinicName: clinicName || '',
      clinicAddress: clinicAddress || '',
      city: city || '',
      state: state || '',
      zipCode: zipCode || '',
      availableDays: parsedAvailableDays,
      availableTimeStart: availableTimeStart || '',
      availableTimeEnd: availableTimeEnd || '',
      emergencyServices: emergencyServices === 'true' || emergencyServices === true,
      homeVisits: homeVisits === 'true' || homeVisits === true,
      bio: bio || '',
      profileImage: profileImagePath,
      licenseCopy: licenseCopyPath
    });

    // Save to database
    await newVeterinarian.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      veterinarian: {
        id: newVeterinarian._id,
        name: `${firstName} ${lastName}`,
        email,
        status: newVeterinarian.status
      }
    });
  } catch (error) {
    console.error('Error in veterinarian application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};