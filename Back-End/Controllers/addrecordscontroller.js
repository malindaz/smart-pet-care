const addrecords = require('../Models/addrecordsmodel');

// Get all pet records
exports.getAllRecords = async (req, res) => {
  try {
    const records = await addrecords.find();
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get a single pet record
exports.getRecord = async (req, res) => {
  try {
    const record = await addrecords.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Pet record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid record ID'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get records by pet ID
exports.getRecordsByPetId = async (req, res) => {
  try {
    const records = await addrecords.find({ petId: req.params.petId });
    
    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No records found for this pet ID'
      });
    }
    
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create a new pet record
exports.createRecord = async (req, res) => {
  try {
    const record = await addrecords.create(req.body);
    
    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'This pet ID already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update a pet record
exports.updateRecord = async (req, res) => {
  try {
    const record = await addrecords.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Pet record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete a pet record
exports.deleteRecord = async (req, res) => {
  try {
    const record = await addrecords.findByIdAndDelete(req.params.id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Pet record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};