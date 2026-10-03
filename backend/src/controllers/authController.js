import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/constants.js';

export const register = (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const insert = db.prepare(`
      INSERT INTO users (name, email, password_hash, phone, role)
      VALUES (?, ?, ?, ?, 'customer')
    `);

    const result = insert.run(name.trim(), email.toLowerCase().trim(), passwordHash, phone || null);
    const userId = result.lastInsertRowid;

    const user = {
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || null,
      role: 'customer',
      avatar_url: null
    };

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const login = (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar_url: user.avatar_url
    };

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

export const updateProfile = (req, res, next) => {
  try {
    const { name, phone, avatar_url } = req.body;
    db.prepare('UPDATE users SET name = ?, phone = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(name || req.user.name, phone !== undefined ? phone : req.user.phone, avatar_url !== undefined ? avatar_url : req.user.avatar_url, req.user.id);

    const updatedUser = db.prepare('SELECT id, name, email, phone, role, avatar_url FROM users WHERE id = ?').get(req.user.id);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
    const isMatch = bcrypt.compareSync(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newHash, req.user.id);

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
};

export const getAddresses = (req, res, next) => {
  try {
    const addresses = db.prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC').all(req.user.id);
    res.json({ success: true, addresses });
  } catch (error) {
    next(error);
  }
};

export const saveAddress = (req, res, next) => {
  try {
    const { fullName, phone, addressLine, city, state, pincode, isDefault, addressType } = req.body;

    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: 'All address fields are required.' });
    }

    if (isDefault) {
      db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(req.user.id);
    }

    const insert = db.prepare(`
      INSERT INTO addresses (user_id, full_name, phone, address_line, city, state, pincode, is_default, address_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      req.user.id,
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      isDefault ? 1 : 0,
      addressType || 'home'
    );

    const address = db.prepare('SELECT * FROM addresses WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Address saved successfully.',
      address
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = (req, res, next) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM addresses WHERE id = ? AND user_id = ?').run(id, req.user.id);
    res.json({ success: true, message: 'Address removed.' });
  } catch (error) {
    next(error);
  }
};
