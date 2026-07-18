import { db } from '../config/firebase.js';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export const getHotels = async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database service unavailable.' });
    
    const hotelsRef = collection(db, 'hotels');
    const q = query(hotelsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const hotels = [];
    snapshot.forEach(docSnap => {
      hotels.push({ id: docSnap.id, ...docSnap.data() });
    });
    
    res.status(200).json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Server error fetching hotels' });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!db) return res.status(503).json({ error: 'Database service unavailable.' });
    
    const hotelRef = doc(db, 'hotels', id);
    const hotelDoc = await getDoc(hotelRef);
    
    if (!hotelDoc.exists()) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    res.status(200).json({ id: hotelDoc.id, ...hotelDoc.data() });
  } catch (error) {
    console.error('Error fetching hotel by id:', error);
    res.status(500).json({ error: 'Server error fetching hotel' });
  }
};

export const createHotel = async (req, res) => {
  try {
    const { name, location, description, image, images, price, rating, amenities, fullDesc, highlights } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({ error: 'Name and Location are required' });
    }
    if (!db) return res.status(503).json({ error: 'Database service unavailable.' });
    
    const hotelData = {
      name,
      location,
      description: description || '',
      image: image || '',
      images: images || (image ? [image] : []),
      price: price || 0,
      rating: rating || 5,
      amenities: amenities || [],
      fullDesc: fullDesc || '',
      highlights: highlights || [],
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'hotels'), hotelData);
    res.status(201).json({ success: true, hotel: { id: docRef.id, ...hotelData } });
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ error: 'Server error creating hotel' });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, description, image, images, price, rating, amenities, fullDesc, highlights } = req.body;
    if (!db) return res.status(503).json({ error: 'Database service unavailable.' });
    
    const hotelRef = doc(db, 'hotels', id);
    const hotelDoc = await getDoc(hotelRef);
    
    if (!hotelDoc.exists()) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    const updatedData = {
      ...(name && { name }),
      ...(location && { location }),
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
      ...(images !== undefined && { images }),
      ...(price !== undefined && { price }),
      ...(rating !== undefined && { rating }),
      ...(amenities !== undefined && { amenities }),
      ...(fullDesc !== undefined && { fullDesc }),
      ...(highlights !== undefined && { highlights }),
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(hotelRef, updatedData);
    res.status(200).json({ success: true, hotel: { id, ...hotelDoc.data(), ...updatedData } });
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ error: 'Server error updating hotel' });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!db) return res.status(503).json({ error: 'Database service unavailable.' });
    
    const hotelRef = doc(db, 'hotels', id);
    await deleteDoc(hotelRef);
    
    res.status(200).json({ success: true, message: 'Hotel deleted' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ error: 'Server error deleting hotel' });
  }
};
