import { Router } from 'express';
import { addProduct, searchProduct, getProducts, deleteProduct, togglePinProduct, updateProduct } from '../controllers/productController.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { browserCache } from '../middleware/browserCache.js';

const router = Router();

router.get('/', browserCache(300), getProducts);
router.post('/', adminAuth, addProduct);
router.get('/search', searchProduct);
router.delete('/:id', adminAuth, deleteProduct);
router.patch('/:id/pin', adminAuth, togglePinProduct);
router.put('/:id', adminAuth, updateProduct);

export default router;