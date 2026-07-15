import fs from 'fs';

// 1. Update bookingController.js
let controllerContent = fs.readFileSync('controllers/bookingController.js', 'utf8');

const cancelBookingCode = `
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId, type } = req.params;
    if (!db) {
      return res.status(503).json({ error: 'Database service unavailable.' });
    }
    
    let collectionName = '';
    if (type === 'package') collectionName = 'package_bookings';
    else if (type === 'hotel') collectionName = 'hotel_bookings';
    else if (type === 'vehicle') collectionName = 'vehicle_bookings';
    else return res.status(400).json({ error: 'Invalid booking type' });

    const bookingRef = doc(db, collectionName, bookingId);
    await deleteDoc(bookingRef);

    res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Server error cancelling booking' });
  }
};
`;

if (!controllerContent.includes('cancelBooking')) {
  controllerContent += cancelBookingCode;
  fs.writeFileSync('controllers/bookingController.js', controllerContent);
}

// 2. Update bookingRoutes.js
let routesContent = fs.readFileSync('routes/bookingRoutes.js', 'utf8');
if (!routesContent.includes('cancelBooking')) {
  routesContent = routesContent.replace(
    "import { bookPackage, bookHotel, getUserBookings, bookVehicle } from '../controllers/bookingController.js';",
    "import { bookPackage, bookHotel, getUserBookings, bookVehicle, cancelBooking } from '../controllers/bookingController.js';"
  );
  routesContent = routesContent.replace(
    "export default router;",
    "router.delete('/:type/:bookingId', cancelBooking);\n\nexport default router;"
  );
  fs.writeFileSync('routes/bookingRoutes.js', routesContent);
}

