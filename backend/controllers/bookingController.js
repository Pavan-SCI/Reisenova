import { db } from '../config/firebase.js';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { sendBookingConfirmationEmail } from '../services/emailService.js';

export const bookPackage = async (req, res) => {
  try {
    const { userId, packageId, packageDetails, userEmail } = req.body;
    if (!userId || !packageId) {
      return res.status(400).json({ error: 'User ID and Package ID are required' });
    }
    
    if (!db) {
      return res.status(503).json({ error: 'Database service unavailable.' });
    }

    const bookingData = {
      userId,
      userEmail,
      packageId,
      packageDetails,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'package_bookings'), bookingData);

    // Send email asynchronously so it doesn't block response
    if (userEmail && userEmail !== 'unknown_user') {
      sendBookingConfirmationEmail(userEmail, 'package', bookingData).catch(err => console.error("Email send failed", err));
    }

    res.status(201).json({ success: true, booking: { id: docRef.id, ...bookingData } });
  } catch (error) {
    console.error('Error booking package:', error);
    res.status(500).json({ error: 'Server error booking package' });
  }
};

export const bookHotel = async (req, res) => {
  try {
    const { userId, hotelId, hotelDetails, userEmail, checkIn, checkOut, guests } = req.body;

    if (!userId || !hotelId) {
      return res.status(400).json({ error: 'User ID and Hotel ID are required' });
    }

    if (!db) {
      return res.status(503).json({ error: 'Database service unavailable.' });
    }

    const bookingData = {
      userId,
      userEmail,
      hotelId,
      hotelDetails,
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      guests: guests || 1,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'hotel_bookings'), bookingData);

    // Send email asynchronously so it doesn't block response
    if (userEmail && userEmail !== 'unknown_user') {
      sendBookingConfirmationEmail(userEmail, 'hotel', bookingData).catch(err => console.error("Email send failed", err));
    }

    res.status(201).json({ success: true, booking: { id: docRef.id, ...bookingData } });
  } catch (error) {
    console.error('Error booking hotel:', error);
    res.status(500).json({ error: 'Server error booking hotel' });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!db) {
      return res.status(503).json({ error: 'Database service unavailable.' });
    }

    const packagesSnapshot = await getDocs(query(collection(db, 'package_bookings'), where('userId', '==', userId)));
    const hotelsSnapshot = await getDocs(query(collection(db, 'hotel_bookings'), where('userId', '==', userId)));

    const vehiclesSnapshot = await getDocs(query(collection(db, 'vehicle_bookings'), where('userId', '==', userId)));
    const packageBookings = [];
    packagesSnapshot.forEach(docSnap => {
      packageBookings.push({ id: docSnap.id, type: 'package', ...docSnap.data() });
    });

    const hotelBookings = [];
    hotelsSnapshot.forEach(docSnap => {
      hotelBookings.push({ id: docSnap.id, type: 'hotel', ...docSnap.data() });
    });

    const vehicleBookings = [];
    vehiclesSnapshot.forEach(docSnap => {
      vehicleBookings.push({ id: docSnap.id, type: 'vehicle', ...docSnap.data() });
    });
    res.status(200).json({
      packages: packageBookings,
      hotels: hotelBookings, vehicles: vehicleBookings
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
};

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
