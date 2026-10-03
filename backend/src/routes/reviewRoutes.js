import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/products/:productId/reviews', reviewController.getProductReviews);
router.post('/products/:productId/reviews', authenticate, reviewController.addReview);
router.post('/reviews/:reviewId/helpful', reviewController.markHelpful);

export default router;
