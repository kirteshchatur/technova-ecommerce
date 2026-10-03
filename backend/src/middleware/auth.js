import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants.js';
import db from '../config/db.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT id, name, email, phone, role, avatar_url FROM users WHERE id = ?').get(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User session invalid. Please log in again.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
};

export const requireAdmin = (req, res, next) => {
  authenticate(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ success: false, message: 'Access denied: Admin privileges required.' });
    }
  });
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT id, name, email, phone, role, avatar_url FROM users WHERE id = ?').get(decoded.id);
    if (user) {
      req.user = user;
    }
  } catch (err) {
    // Ignore invalid token for optional auth
  }
  next();
};
