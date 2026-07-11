const { db } = require('../config/firebase');

/**
 * @desc    Submit a new trip request
 * @route   POST /api/trips
 * @access  Public
 */
const createTripRequest = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      country,
      arrivalDate,
      duration,
      adults,
      children,
      accommodation,
      budget,
      interests,
      additionalInfo
    } = req.body;

    // Validate required fields
    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full Name and Email are required' });
    }

    if (!db) {
      return res.status(503).json({ error: 'Database service is currently unavailable. Please configure Firebase.' });
    }

    const tripData = {
      fullName,
      email,
      phone: phone || '',
      country: country || '',
      arrivalDate: arrivalDate || null,
      duration: duration ? parseInt(duration) : null,
      adults: adults ? parseInt(adults) : 1,
      children: children ? parseInt(children) : 0,
      accommodation: accommodation || '',
      budget: budget || '',
      interests: interests || [],
      additionalInfo: additionalInfo || '',
      createdAt: new Date().toISOString(),
      status: 'pending' // pending, reviewed, contacted, booked
    };

    // Save to Firestore 'trips' collection
    const docRef = await db.collection('trips').add(tripData);

    res.status(201).json({
      success: true,
      message: 'Trip request submitted successfully',
      tripId: docRef.id
    });
  } catch (error) {
    console.error('Error creating trip request:', error);
    res.status(500).json({ error: 'Server error while submitting trip request' });
  }
};

/**
 * @desc    Get all trip requests (For admin dashboard)
 * @route   GET /api/trips
 * @access  Private (Needs Authentication later)
 */
const getAllTrips = async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database service is currently unavailable. Please configure Firebase.' });
    }

    const snapshot = await db.collection('trips').orderBy('createdAt', 'desc').get();
    const trips = [];
    
    snapshot.forEach(doc => {
      trips.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Server error while fetching trips' });
  }
};

module.exports = {
  createTripRequest,
  getAllTrips
};
