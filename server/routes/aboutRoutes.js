import express from 'express';
import { getAboutContent, updateAboutContent } from '../controllers/aboutController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', getAboutContent);
router.post('/', adminAuth, updateAboutContent);

export default router;
