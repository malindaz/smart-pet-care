const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise} Mongoose connection promise
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit with failure
  }
};

module.exports = { connectDB };