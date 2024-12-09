import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  // Get token from Authorization header and ensure it follows "Bearer <token>" format
  const token = req.header('Authorization') && req.header('Authorization').startsWith('Bearer') 
                ? req.header('Authorization').split(' ')[1]
                : null;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure user exists in the database
    const user = await User.findById(decoded.id); 
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    // Attach user details to the request object
    req.user = { id: user._id, role: user.role };
    next(); // Proceed to the next middleware/route handler

  } catch (error) {
    // Handle cases where the token is invalid or expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    res.status(400).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
