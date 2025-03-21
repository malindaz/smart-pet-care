const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./utils/db');

const bodyParser = require('body-parser');

const fileupload = require('express-fileupload');


const pharmacyRoutes = require('./Routes/pharmacyRoutes');
const userRoutes = require('./Routes/userRoutes');
const appointmentRoutes = require('./Routes/appointmentRoutes');
const addrecordsroute = require('./Routes/addrecordsroute');




const addnewroute = require('./Routes/addnewroute');

const veterinarianRoutes = require('./Routes/veterinarianRoutes');
const addnewroute = require('./Routes/addnewroute');
const adminRoutes = require('./Routes/adminRoutes');




// Load environment variables

dotenv.config();

const app = express();


// ✅ Serve static files before other middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Increase request body size limit
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// ✅ Use CORS only once

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Security middleware
app.use(helmet());

app.use('/api', limiter);

// ✅ Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/addrecords', addrecordsroute);

app.use('/api/users', userRoutes);

// ✅ Development logging


// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileupload({
    createParentPath: true,
    limits: { fileSize: 100 * 1024 * 1024 } // 10MB
}))

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

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
app.use('/api/addrecords', addrecordsroute);
app.use('/api/veterinarians', veterinarianRoutes);

app.use('/api/pets', addnewroute);

app.use('/api/admin', adminRoutes);

app.use('/uploads', express.static('uploads'));



// Development logging

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


// ✅ Connect to MongoDB
connectDB();

// ✅ Test route

// Connect to MongoDB
connectDB();

// Simple route for testing

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
    });
});


// ✅ Error handling middleware

// Error handling middleware

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Something went wrong on the server',
    });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
});

