const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware for authenticating JWT tokens
const authenticate = async (req, res, next) => {
  try {
    // Retrieve token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // If no token is provided, return 401
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if JWT_SECRET is defined in the environment variables
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: "Server configuration error" });
    }
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(decoded.userId);

if (!req.user) {
  return res.status(401).json({ message: "User not found" });
}

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('JWT Authentication Error:', error.message);

    // Handle specific JWT errors
    const message =
      error.name === 'TokenExpiredError'
        ? "Token expired"
        : error.name === 'JsonWebTokenError'
        ? "Invalid token structure"
        : "Invalid token";

    return res.status(401).json({ message });
  }
};

module.exports = { authenticate };
