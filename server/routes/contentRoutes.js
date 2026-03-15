import express from 'express';
import { getLatestContent, addInstagramReel, getInstagramReels, deleteInstagramReel } from '../controllers/contentController.js';
import { upload } from '../middleware/upload.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { browserCache } from '../middleware/browserCache.js';

const router = express.Router();

router.get('/latest', browserCache(300), getLatestContent);

// Instagram Reel Manual Entry Routes
router.get('/instagram', browserCache(300), getInstagramReels);

router.post('/instagram', adminAuth, upload.single('thumbnail'), addInstagramReel);
router.delete('/instagram/:id', adminAuth, deleteInstagramReel);

export default router;