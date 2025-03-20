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

// Routes
const pharmacyRoutes = require('./Routes/pharmacyRoutes');
const userRoutes = require('./Routes/userRoutes');
const appointmentRoutes = require('./Routes/appointmentRoutes');
const addrecordsroute = require('./Routes/addrecordsroute');
const addnewroute = require('./Routes/addnewroute');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Serve static files with proper headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  }
}));

// Body parser configuration
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Routes with file upload handling
app.use('/api/addrecords', upload.single('file'), addrecordsroute);
app.use('/api/pets', upload.single('image'), addnewroute);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/users', userRoutes);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Connect to MongoDB
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle Multer errors specifically
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }

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