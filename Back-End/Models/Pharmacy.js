const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Prescription Medications',
      'OTC Medications & Supplements',
      'Grooming & Hygiene',
      'Pet Food & Specialized Diets',
      'First Aid & Wound Care'
    ]
  },
  name: {
    type: String,
    required: [true, 'Product name is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  image: {
    type: String, // Storing image URL or file path
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);

module.exports = Pharmacy;
