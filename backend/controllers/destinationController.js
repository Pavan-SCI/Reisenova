import { db } from '../config/firebase.js';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';

export const getDestinations = async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database service unavailable.' });
    }
    const snapshot = await getDocs(query(collection(db, 'destinations'), orderBy('createdAt', 'desc')));
    const destinations = [];
    snapshot.forEach(docSnap => {
      destinations.push({ id: docSnap.id, ...docSnap.data() });
    });
    res.status(200).json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Server error fetching destinations' });
  }
};

export const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!db) {
      return res.status(503).json({ error: 'Database service unavailable.' });
    }
    const destRef = doc(db, 'destinations', id);
    const destDoc = await getDoc(destRef);
    if (!destDoc.exists()) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.status(200).json({ id: destDoc.id, ...destDoc.data() });
  } catch (error) {
    console.error('Error fetching destination by id:', error);
    res.status(500).json({ error: 'Server error fetching destination' });
  }
};

export const createDestination = async (req, res) => {
  try {
    const { name, location, description, image, images, price, highlights, fullDesc, bestTimeToVisit, activities } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({ error: 'Name and Location are required' });
    }

    if (!db) {
      return res.status(503).json({ error: 'Database service unavailable.' });
    }

    const destData = {
      name,
      location,
      description: description || '',
      image: image || '',
      images: images || (image ? [image] : []),
      price: price || 0,
      highlights: highlights || [],
      fullDesc: fullDesc || '',
      bestTimeToVisit: bestTimeToVisit || '',
      activities: activities || [],
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'destinations'), destData);
    res.status(201).json({ success: true, destination: { id: docRef.id, ...destData } });
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({ error: 'Server error creating destination' });
  }
};

export const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, description, image, images, price, highlights, fullDesc, bestTimeToVisit, activities } = req.body;

    if (!db) {
      return res.status(503).json({ error: 'Database service unavailable.' });
    }

    const destRef = doc(db, 'destinations', id);
    const destDoc = await getDoc(destRef);

    if (!destDoc.exists()) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    const updatedData = {
      ...(name && { name }),
      ...(location && { location }),
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
      ...(images !== undefined && { images }),
      ...(price !== undefined && { price }),
      ...(highlights !== undefined && { highlights }),
      ...(fullDesc !== undefined && { fullDesc }),
      ...(bestTimeToVisit !== undefined && { bestTimeToVisit }),
      ...(activities !== undefined && { activities }),
      updatedAt: new Date().toISOString()
    };

    await updateDoc(destRef, updatedData);
    res.status(200).json({ success: true, destination: { id, ...destDoc.data(), ...updatedData } });
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({ error: 'Server error updating destination' });
  }
};

export const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    if (!db) {
      return res.status(503).json({ error: 'Database service unavailable.' });
    }

    const destRef = doc(db, 'destinations', id);
    await deleteDoc(destRef);

    res.status(200).json({ success: true, message: 'Destination deleted' });
  } catch (error) {
    console.error('Error deleting destination:', error);
    res.status(500).json({ error: 'Server error deleting destination' });
  }
};
