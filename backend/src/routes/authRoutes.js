import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/password', authenticate, authController.updatePassword);

// User Addresses
router.get('/addresses', authenticate, authController.getAddresses);
router.post('/addresses', authenticate, authController.saveAddress);
router.delete('/addresses/:id', authenticate, authController.deleteAddress);

export default router;
