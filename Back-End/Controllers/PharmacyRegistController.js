const Pharmacy = require('../Models/PharmacyRegistModel');
const path = require('path');

// Apply to register a pharmacy
exports.applyPharmacy = async (req, res) => {
  try {
    // Process form data
    const {
      pharmacyName, businessRegistrationNumber,
      ownerFirstName, ownerLastName,
      email, phone,
      pharmacyLicenseNumber, licenseIssuingAuthority, licenseExpiryDate,
      addressLine1, addressLine2, city, state, zipCode,
      operatingHours, specializedServices,
      deliveryAvailable, onlineOrderingAvailable, emergencyServices,
      pharmacistDetails, description
    } = req.body;

    // Check if required files were uploaded
    if (!req.files || 
        !req.files.businessRegistrationDocument || 
        !req.files.pharmacyLicenseDocument) {
      return res.status(400).json({ 
        success: false,
        message: 'Business registration and pharmacy license documents are required' 
      });
    }

    // Parse JSON strings safely
    let parsedPharmacistDetails = [];
    try {
      parsedPharmacistDetails = req.body.pharmacistDetails 
        ? JSON.parse(req.body.pharmacistDetails) 
        : [];
    } catch (error) {
      console.error('Error parsing pharmacist details:', error);
    }

    let parsedSpecializedServices = [];
    try {
      parsedSpecializedServices = req.body.specializedServices
        ? JSON.parse(req.body.specializedServices)
        : [];
    } catch (error) {
      console.error('Error parsing specialized services:', error);
    }

    // Get file paths
    const businessDocFile = req.files.businessRegistrationDocument[0];
    const pharmacyLicenseFile = req.files.pharmacyLicenseDocument[0];
    
    // Optional profile image
    let profileImagePath = '';
    if (req.files.profileImage && req.files.profileImage[0]) {
      const profileImageFile = req.files.profileImage[0];
      profileImagePath = `/uploads/pharmacy-profile-images/${path.basename(profileImageFile.path)}`;
    }

    // Create paths relative to the uploads directory
    const businessDocPath = `/uploads/pharmacy-documents/${path.basename(businessDocFile.path)}`;
    const pharmacyLicensePath = `/uploads/pharmacy-documents/${path.basename(pharmacyLicenseFile.path)}`;

    // Create new pharmacy document
    const newPharmacy = new Pharmacy({
      pharmacyName: pharmacyName || '',
      businessRegistrationNumber: businessRegistrationNumber || '',
      ownerFirstName: ownerFirstName || '',
      ownerLastName: ownerLastName || '',
      email: email || '',
      phone: phone || '',
      pharmacyLicenseNumber: pharmacyLicenseNumber || '',
      licenseIssuingAuthority: licenseIssuingAuthority || '',
      licenseExpiryDate: licenseExpiryDate || new Date(),
      addressLine1: addressLine1 || '',
      addressLine2: addressLine2 || '',
      city: city || '',
      state: state || '',
      zipCode: zipCode || '',
      operatingHours: JSON.parse(operatingHours || '{}'),
      specializedServices: parsedSpecializedServices,
      deliveryAvailable: deliveryAvailable === 'true' || deliveryAvailable === true,
      onlineOrderingAvailable: onlineOrderingAvailable === 'true' || onlineOrderingAvailable === true,
      emergencyServices: emergencyServices === 'true' || emergencyServices === true,
      pharmacistDetails: parsedPharmacistDetails,
      businessRegistrationDocument: businessDocPath,
      pharmacyLicenseDocument: pharmacyLicensePath,
      profileImage: profileImagePath,
      description: description || ''
    });

    // Save to database
    await newPharmacy.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Pharmacy registration submitted successfully',
      pharmacy: {
        id: newPharmacy._id,
        name: pharmacyName,
        email,
        status: newPharmacy.status
      }
    });
  } catch (error) {
    console.error('Error in pharmacy registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit pharmacy registration',
      error: error.message
    });
  }
};

// Get all pharmacy registrations (admin)
exports.getAllPharmacyRegistrations = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({});
    res.status(200).json({
      success: true,
      data: pharmacies
    });
  } catch (error) {
    console.error('Error fetching pharmacy registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pharmacy registrations',
      error: error.message
    });
  }
};

// Update pharmacy registration status
exports.updatePharmacyStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    
    const updatedPharmacy = await Pharmacy.findByIdAndUpdate(
      id, 
      { status, updatedAt: new Date() }, 
      { new: true }
    );

    if (!updatedPharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy registration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Pharmacy registration ${status} successfully`,
      data: updatedPharmacy
    });
  } catch (error) {
    console.error('Error updating pharmacy status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pharmacy status',
      error: error.message
    });
  }
};