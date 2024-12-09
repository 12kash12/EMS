import express from 'express';
import { submitFeedback, updateFeedback, deleteFeedback } from '../controllers/feedbackController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();


//Router to submiting our feedback
router.post('/', authMiddleware, submitFeedback);

//Router to update/edit our feedback
router.put('/', authMiddleware, updateFeedback);

//Router to delete our feedback
router.delete('/', authMiddleware, deleteFeedback);

export default router;
