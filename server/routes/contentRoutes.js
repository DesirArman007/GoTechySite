import express from 'express';
import { getLatestContent, addInstagramReel, getInstagramReels, deleteInstagramReel } from '../controllers/contentController.js';
import { upload } from '../middleware/upload.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// Cache latest content for 5 minutes
router.get('/latest', cacheMiddleware('content', 300), getLatestContent);

// Instagram Reel Manual Entry Routes
router.get('/instagram', cacheMiddleware('instagram', 300), getInstagramReels);

// Protect write routes and invalidate cache
router.post('/instagram', adminAuth, upload.single('thumbnail'), invalidateCache('instagram'), addInstagramReel);
router.delete('/instagram/:id', adminAuth, invalidateCache('instagram'), deleteInstagramReel);

export default router;