import { Router } from 'express';
import { addProduct, searchProduct, getProducts, deleteProduct, togglePinProduct, updateProduct } from '../controllers/productController.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

router.get('/', cacheMiddleware('products', 300), getProducts);
router.post('/', adminAuth, invalidateCache('products'), addProduct);
router.get('/search', searchProduct); // Search is dynamic, maybe don't cache or short cache
router.delete('/:id', adminAuth, invalidateCache('products'), deleteProduct);
router.patch('/:id/pin', adminAuth, invalidateCache('products'), togglePinProduct);
router.put('/:id', adminAuth, invalidateCache('products'), updateProduct);

export default router;