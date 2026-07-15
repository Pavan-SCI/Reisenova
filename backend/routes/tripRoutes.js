import express from 'express';
import { createTripRequest, getAllTrips } from '../controllers/tripController.js';

const router = express.Router();

// Route: /api/trips
router.route('/')
  .post(createTripRequest) // Public route to submit a form
  .get(getAllTrips);       // Admin route to view forms (will need auth middleware later)

export default router;
