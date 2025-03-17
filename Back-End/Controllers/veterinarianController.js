// controllers/veterinarianController.js
const Veterinarian = require('../Models/Veterinarian');
const fs = require('fs');
const path = require('path');

// Upload directory configuration
const uploadDir = path.join(__dirname, '../uploads');
const profileImagesDir = path.join(uploadDir, 'profile-images');
const licenseDocumentsDir = path.join(uploadDir, 'license-documents');

// Ensure directories exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(profileImagesDir)) {
  fs.mkdirSync(profileImagesDir);
}
if (!fs.existsSync(licenseDocumentsDir)) {
  fs.mkdirSync(licenseDocumentsDir);
}

// Apply to become a veterinarian
exports.applyVeterinarian = async (req, res) => {
  try {
    // Process form data
    const {
      firstName, lastName, email, phone,
      licenseNumber, licenseIssuingAuthority, licenseExpiryDate,
      specialization, yearsOfExperience,
      clinicName, clinicAddress, city, state, zipCode,
      availableDays, availableTimeStart, availableTimeEnd,
      emergencyServices, homeVisits, bio, agreeToTerms
    } = req.body;

    // Parse JSON strings from form data
    const education = JSON.parse(req.body.education);
    const additionalCertifications = req.body.additionalCertifications 
      ? JSON.parse(req.body.additionalCertifications) 
      : [];
    const parsedAvailableDays = Array.isArray(availableDays) 
      ? availableDays 
      : JSON.parse(availableDays);

    // Handle file uploads
    if (!req.files || !req.files.profileImage || !req.files.licenseCopy) {
      return res.status(400).json({ message: 'Profile image and license copy are required' });
    }

    const profileImage = req.files.profileImage;
    const licenseCopy = req.files.licenseCopy;

    // Generate unique filenames
    const profileImageName = `${Date.now()}-${profileImage.name}`;
    const licenseCopyName = `${Date.now()}-${licenseCopy.name}`;

    // Save files to server
    const profileImagePath = path.join(profileImagesDir, profileImageName);
    const licenseCopyPath = path.join(licenseDocumentsDir, licenseCopyName);

    await profileImage.mv(profileImagePath);
    await licenseCopy.mv(licenseCopyPath);

    // Create new veterinarian document
    const newVeterinarian = new Veterinarian({
      firstName,
      lastName,
      email,
      phone,
      licenseNumber,
      licenseIssuingAuthority,
      licenseExpiryDate,
      specialization,
      yearsOfExperience: Number(yearsOfExperience),
      education,
      additionalCertifications,
      clinicName,
      clinicAddress,
      city,
      state,
      zipCode,
      availableDays: parsedAvailableDays,
      availableTimeStart,
      availableTimeEnd,
      emergencyServices: emergencyServices === 'true' || emergencyServices === true,
      homeVisits: homeVisits === 'true' || homeVisits === true,
      bio,
      profileImage: `/uploads/profile-images/${profileImageName}`,
      licenseCopy: `/uploads/license-documents/${licenseCopyName}`
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