import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  generateNewTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from '../controllers/tripController.js';

export const tripRouter = express.Router();

// All trip routes require authentication
tripRouter.use(authenticateToken);

tripRouter.post('/', generateNewTrip);
tripRouter.get('/', getUserTrips);
tripRouter.get('/:tripId', getTripById);
tripRouter.put('/:tripId', updateTrip);
tripRouter.delete('/:tripId', deleteTrip);
