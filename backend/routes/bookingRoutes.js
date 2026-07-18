import express from 'express';
import { bookPackage, bookHotel, getUserBookings, bookVehicle, cancelBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/package', bookPackage);
router.post('/hotel', bookHotel);
router.post('/vehicle', bookVehicle);
router.get('/user/:userId', getUserBookings);

router.delete('/:type/:bookingId', cancelBooking);

export default router;
