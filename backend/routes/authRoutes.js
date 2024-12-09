import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';  // Correct path to middleware
import { 
    registerAttendee, 
    loginAttendee, 
    getProfile, 
    updateProfile,
    deleteProfile
} from '../controllers/authController.js';  // Assuming the controller has named exports


const router = express.Router();

// Routes for authentication and profile
router.post('/register', registerAttendee);  // Register user
router.post('/login', loginAttendee);        // Login user
router.get('/profile', authMiddleware, getProfile);  // Get user profile
router.put('/profile', authMiddleware, updateProfile);  // Update user profile
router.delete('/profile', authMiddleware, deleteProfile); // Delete user profile

export default router;  // Export the router, not individual functions
