import express from 'express';
import * as wishlistController from '../controllers/wishlistController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', wishlistController.getWishlist);
router.post('/:productId', wishlistController.toggleWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

export default router;
