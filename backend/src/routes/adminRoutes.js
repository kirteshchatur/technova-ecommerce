import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/metrics', adminController.getDashboardMetrics);

// Product management
router.get('/products', adminController.getAdminProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Inventory
router.get('/inventory', adminController.getInventory);
router.put('/inventory/:id', adminController.updateStock);

// Orders
router.get('/orders', adminController.getAdminOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Customers
router.get('/customers', adminController.getCustomers);

// Coupons
router.get('/coupons', adminController.getAdminCoupons);
router.post('/coupons', adminController.createCoupon);
router.put('/coupons/:id/toggle', adminController.toggleCoupon);

export default router;
