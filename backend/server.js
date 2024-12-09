import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import feedbackRoutes from './routes/feedbackRoutes.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import cors from 'cors';

dotenv.config();

// Create an express app instance
const app = express();

// Apply CORS middleware to allow requests from your frontend (localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000', // Change '*' for more flexibility in dev environment
}));

// Middleware
app.use(express.json());  // This should be after initializing `app`

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Log every incoming request for debugging purposes
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next(); // Proceed to the next middleware/route
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/feedback', feedbackRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.status(200).send('Test Route Works');
});

// Catch all for 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found. Please check the URL.' });
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
