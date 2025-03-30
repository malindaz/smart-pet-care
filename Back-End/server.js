const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./utils/db');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

// Ensure upload directories exist
const uploadDir = path.join(__dirname, 'uploads');
const profileImagesDir = path.join(uploadDir, 'profile-images');
const licenseDocumentsDir = path.join(uploadDir, 'license-documents');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(profileImagesDir)) {
  fs.mkdirSync(profileImagesDir);
}
if (!fs.existsSync(licenseDocumentsDir)) {
  fs.mkdirSync(licenseDocumentsDir);
}

const app = express();

// Load environment variables
dotenv.config();

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

// Increase request body size limit
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Import routes
const pharmacyRoutes = require('./Routes/pharmacyRoutes');
const userRoutes = require('./Routes/userRoutes');
const appointmentRoutes = require('./Routes/appointmentRoutes');
const addrecordsroute = require('./Routes/addrecordsroute');
const veterinarianRoutes = require('./Routes/veterinarianRoutes');
const addnewroute = require('./Routes/addnewroute');
const adminRoutes = require('./Routes/adminRoutes');
const pharmacyRegistRoutes = require('./Routes/PharmacyRegistRouter');

// Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/addrecords', addrecordsroute);
app.use('/api/users', userRoutes); 
app.use('/api/veterinarians', veterinarianRoutes);
app.use('/api/pets', addnewroute);
app.use('/api/admin', adminRoutes);
app.use('/api/Pharmacys', pharmacyRegistRoutes);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Connect to MongoDB
connectDB();

// Test route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong on the server',
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});