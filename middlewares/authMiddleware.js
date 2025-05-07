import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, error: 'Token missing' });
    }

    // Verify JWT and catch any malformed token errors
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded._id || decoded.id;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Invalid token payload' });
      }

      const user = await User.findById(userId).select('-password');

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(400).json({ success: false, error: 'Invalid or malformed token' });
    }
  } catch (error) {
    console.error('verifyUser middleware error:', error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};
