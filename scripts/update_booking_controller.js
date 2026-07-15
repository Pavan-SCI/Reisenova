import fs from 'fs';
let content = fs.readFileSync('controllers/bookingController.js', 'utf8');

if (!content.includes('bookVehicle')) {
  const newMethod = `
export const bookVehicle = async (req, res) => {
  try {
    const { userId, vehicleId, vehicleDetails, userEmail, pickupDate, dropoffDate, pickupLocation } = req.body;
    if (!userId || !vehicleId) {
      return res.status(400).json({ error: 'User ID and Vehicle ID are required' });
    }
    if (!db) {
      return res.status(503).json({ error: 'Database service unavailable.' });
    }
    const bookingData = {
      userId,
      userEmail,
      vehicleId,
      vehicleDetails,
      pickupDate: pickupDate || null,
      dropoffDate: dropoffDate || null,
      pickupLocation: pickupLocation || '',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'vehicle_bookings'), bookingData);
    if (userEmail && userEmail !== 'unknown_user') {
      sendBookingConfirmationEmail(userEmail, 'vehicle', bookingData).catch(err => console.error("Email send failed", err));
    }
    res.status(201).json({ success: true, booking: { id: docRef.id, ...bookingData } });
  } catch (error) {
    console.error('Error booking vehicle:', error);
    res.status(500).json({ error: 'Server error booking vehicle' });
  }
};
`;
  content += newMethod;
  fs.writeFileSync('controllers/bookingController.js', content);
}
