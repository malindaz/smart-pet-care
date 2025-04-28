const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const veterinarianSchema = new Schema({
  // Personal Information
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
  
  // Professional Credentials
  licenseNumber: {
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
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Education
  education: [{
    institution: {
      type: String,
      required: true,
      trim: true
    },
    degree: {
      type: String,
      required: true,
      trim: true
    },
    yearCompleted: {
      type: String,
      required: true,
      trim: true
    }
  }],
  
  // Additional Certifications
  additionalCertifications: [{
    name: {
      type: String,
      trim: true
    },
    issuingBody: {
      type: String,
      trim: true
    },
    year: {
      type: String,
      trim: true
    }
  }],
  
  // Practice Details
  clinicName: {
    type: String,
    required: true,
    trim: true
  },
  clinicAddress: {
    type: String,
    required: true,
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
  
  // Availability
  availableDays: {
    type: [String],
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  availableTimeStart: {
    type: String,
    required: true
  },
  availableTimeEnd: {
    type: String,
    required: true
  },
  emergencyServices: {
    type: Boolean,
    default: false
  },
  homeVisits: {
    type: Boolean,
    default: false
  },
  
  // Profile
  bio: {
    type: String,
    required: true,
    trim: true,
    minlength: 100
  },
  profileImage: {
    type: String,
    required: true
  },
  licenseCopy: {
    type: String,
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
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

module.exports = mongoose.model('Veterinarian', veterinarianSchema);