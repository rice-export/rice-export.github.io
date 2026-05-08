const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('./errorHandler');

// Protect Routes - Verify JWT Token
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user to request
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return next(new AppError('User not found', 404));
    }

    next();
  } catch (error) {
    next(new AppError('Not authorized to access this route', 401));
  }
};

// Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(new AppError(`User role ${req.user?.role} is not authorized`, 403));
    }
    next();
  };
};

module.exports = { protect, authorize };
