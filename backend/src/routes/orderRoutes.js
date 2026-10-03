import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/track/:orderNumber', orderController.trackOrder);
router.post('/', authenticate, orderController.createOrder);
router.get('/', authenticate, orderController.getUserOrders);
router.get('/:id', authenticate, orderController.getOrderById);

export default router;
