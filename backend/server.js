import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { authRouter } from './routes/authRoutes.js';
import { tripRouter } from './routes/tripRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB and start server after connection
const startServer = async () => {
  await connectDB();

  // Routes
  app.use('/api/auth', authRouter);
  app.use('/api/trips', tripRouter);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
  });

  app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
  });
};

startServer();
