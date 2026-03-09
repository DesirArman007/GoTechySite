import express from 'express';
import { getTeamMembers, addTeamMember, deleteTeamMember } from "../controllers/teamController.js";
import { upload } from '../middleware/upload.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';
import { adminAuth } from '../middleware/adminAuth.js';


const router = express.Router();


router.get('/', cacheMiddleware('team', 300), getTeamMembers);
router.post('/', adminAuth, upload.single('avatar'), invalidateCache('team'), addTeamMember);
router.delete('/:id', adminAuth, invalidateCache('team'), deleteTeamMember);

export default router;