const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const Dotenv = require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');


const pharmacyRoutes = require('./Routes/pharmacyRoutes');


const userRoutes = require('./Routes/userRoutes');
const appointmentRoutes = require('./Routes/appointmentRoutes');
const addecordsroutes = require('./Routes/addrecordsroute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cors({
  origin: 'http://localhost:3000', // Allow only the frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);


// Routes
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use('/api/pharmacy', pharmacyRoutes);

app.use('/api/addrecords', require('./Routes/addrecordsroute'));


// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}




// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});