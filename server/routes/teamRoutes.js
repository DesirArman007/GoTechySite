import express from 'express';
import { getTeamMembers, addTeamMember, deleteTeamMember } from "../controllers/teamController.js";
import { upload } from '../middleware/upload.js';
import { adminAuth } from '../middleware/adminAuth.js';


const router = express.Router();


router.get('/', getTeamMembers);
router.post('/', adminAuth, upload.single('avatar'), addTeamMember);
router.delete('/:id', adminAuth, deleteTeamMember);

export default router;