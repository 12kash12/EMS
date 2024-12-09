import express from 'express';
import { bookTickets, getTicketHistory } from '../controllers/ticketController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/book', authMiddleware, bookTickets); // Booking tickets
router.get('/history', authMiddleware, getTicketHistory); // View booking history

export default router;
