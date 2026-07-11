const express = require('express');
const router = express.Router();
const { createTripRequest, getAllTrips } = require('../controllers/tripController');

// Route: /api/trips
router.route('/')
  .post(createTripRequest) // Public route to submit a form
  .get(getAllTrips);       // Admin route to view forms (will need auth middleware later)

module.exports = router;
