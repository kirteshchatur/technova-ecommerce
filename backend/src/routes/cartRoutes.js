import express from 'express';
import * as cartController from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:id', cartController.updateCartItem);
router.delete('/:id', cartController.removeCartItem);
router.delete('/', cartController.clearCart);

export default router;
