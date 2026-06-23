import express from 'express';
import cors from 'cors';
import { connectDB } from '../config/db.js';
import { authRouter } from '../routes/authRoutes.js';
import { tripRouter } from '../routes/tripRoutes.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://frontend-phi-flame-38.vercel.app',
  credentials: true,
}));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/trips', tripRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

let connectionPromise;

const ensureDBConnected = async () => {
  if (!connectionPromise) {
    connectionPromise = connectDB();
  }
  return connectionPromise;
};

export default async function handler(req, res) {
  await ensureDBConnected();
  return app(req, res);
}
