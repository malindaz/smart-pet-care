const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const protect = async (req, res, next) => {
    let token;
    
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');
            
            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }
    
    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

// Middleware to check user level
const checkUserLevel = (minLevel) => {
    return (req, res, next) => {
        if (req.user && req.user.userLevel <= minLevel) {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Not authorized, insufficient privileges' });
        }
    };
};

module.exports = { protect, checkUserLevel };