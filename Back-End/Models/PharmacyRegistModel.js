const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pharmacysSchema = new Schema({
  // Business Information
  pharmacyName: {
    type: String,
    required: true,
    trim: true
  },
  businessRegistrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  ownerFirstName: {
    type: String,
    required: true,
    trim: true
  },
  ownerLastName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Contact Information
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  
  // Business License and Credentials
  pharmacyLicenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  licenseIssuingAuthority: {
    type: String,
    required: true,
    trim: true
  },
  licenseExpiryDate: {
    type: Date,
    required: true
  },
  
  // Location Details
  addressLine1: {
    type: String,
    required: true,
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  
  // Operational Details
  operatingHours: {
    monday: {
      open: String,
      close: String
    },
    tuesday: {
      open: String,
      close: String
    },
    wednesday: {
      open: String,
      close: String
    },
    thursday: {
      open: String,
      close: String
    },
    friday: {
      open: String,
      close: String
    },
    saturday: {
      open: String,
      close: String
    },
    sunday: {
      open: String,
      close: String
    }
  },
  
  // Services
  specializedServices: [{
    type: String,
    trim: true
  }],
  deliveryAvailable: {
    type: Boolean,
    default: false
  },
  onlineOrderingAvailable: {
    type: Boolean,
    default: false
  },
  emergencyServices: {
    type: Boolean,
    default: false
  },
  
  // Professional Credentials
  pharmacistDetails: [{
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    licenseExpiryDate: {
      type: Date,
      required: true
    }
  }],
  
  // Document Uploads
  businessRegistrationDocument: {
    type: String,
    required: true
  },
  pharmacyLicenseDocument: {
    type: String,
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Profile Completion
  profileImage: {
    type: String
  },
  
  // Description
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pharmacys', pharmacysSchema);