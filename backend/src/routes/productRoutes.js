import express from 'express';
import * as productController from '../controllers/productController.js';

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/meta/categories', productController.getCategories);
router.get('/meta/brands', productController.getBrands);
router.get('/search/suggestions', productController.getSearchSuggestions);
router.get('/section/deals', productController.getFlashDeals);
router.get('/section/:type', productController.getSectionProducts);
router.get('/:slugOrId', productController.getProductBySlugOrId);

export default router;
