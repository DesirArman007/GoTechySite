import express from 'express';
import { getAboutContent, updateAboutContent } from '../controllers/aboutController.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', cacheMiddleware('about', 300), getAboutContent);
router.post('/', adminAuth, invalidateCache('about'), updateAboutContent);

export default router;
