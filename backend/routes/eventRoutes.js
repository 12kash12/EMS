import express from 'express';
import { getApprovedEvents, addEvent } from '../controllers/eventController.js'; // Import both controllers

const router = express.Router();

// Router to get all approved events
router.get('/', getApprovedEvents);



export default router;
