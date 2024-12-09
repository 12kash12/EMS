import express from 'express';
import { updateProfile, getNotifications, deleteProfile } from '../controllers/profileController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Router to update the our profile
router.put('/', updateProfile);
router.put('/update', authMiddleware, updateProfile);

// Router to fetch the  notifications
router.get('/notifications', authMiddleware, getNotifications);

// Router to delete the our profile
router.delete('/delete', authMiddleware, deleteProfile);

export default router;
