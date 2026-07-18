import { db } from '../config/firebase.js';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';

export const getPackages = async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database service unavailable.' });
    }
    const snapshot = await getDocs(query(collection(db, 'packages'), orderBy('createdAt', 'desc')));
    const packages = [];
    snapshot.forEach(docSnap => {
      packages.push({ id: docSnap.id, ...docSnap.data() });
    });
    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Server error fetching packages' });
  }
};

export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!db) {
      return res.status(503).json({ error: 'Database service unavailable.' });
    }
    const packageRef = doc(db, 'packages', id);
    const packageDoc = await getDoc(packageRef);
    if (!packageDoc.exists()) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.status(200).json({ id: packageDoc.id, ...packageDoc.data() });
  } catch (error) {
    console.error('Error fetching package by id:', error);
    res.status(500).json({ error: 'Server error fetching package' });
  }
};

export const createPackage = async (req, res) => {
  try {
    const { title, duration, description, image, images, price, inclusions, fullDesc, destinations, highlights } = req.body;
    
    if (!title || !duration) {
      return res.status(400).json({ error: 'Title and Duration are required' });
    }

    if (!db) {
      return res.status(503).json({ error: 'Database service unavailable.' });
    }

    const packageData = {
      title,
      duration,
      description: description || '',
      image: image || '',
      images: images || (image ? [image] : []),
      price: price || 0,
      inclusions: inclusions || [],
      fullDesc: fullDesc || '',
      destinations: destinations || [],
      highlights: highlights || [],
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'packages'), packageData);
    res.status(201).json({ success: true, package: { id: docRef.id, ...packageData } });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ error: 'Server error creating package' });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, duration, description, image, images, price, inclusions, fullDesc, destinations, highlights } = req.body;

    if (!db) {
      return res.status(503).json({ error: 'Database service unavailable.' });
    }

    const packageRef = doc(db, 'packages', id);
    const packageDoc = await getDoc(packageRef);

    if (!packageDoc.exists()) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const updatedData = {
      ...(title && { title }),
      ...(duration && { duration }),
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
      ...(images !== undefined && { images }),
      ...(price !== undefined && { price }),
      ...(inclusions !== undefined && { inclusions }),
      ...(fullDesc !== undefined && { fullDesc }),
      ...(destinations !== undefined && { destinations }),
      ...(highlights !== undefined && { highlights }),
      updatedAt: new Date().toISOString()
    };

    await updateDoc(packageRef, updatedData);
    res.status(200).json({ success: true, package: { id, ...packageDoc.data(), ...updatedData } });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'Server error updating package' });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!db) {
      return res.status(503).json({ error: 'Database service unavailable.' });
    }

    const packageRef = doc(db, 'packages', id);
    await deleteDoc(packageRef);

    res.status(200).json({ success: true, message: 'Package deleted' });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ error: 'Server error deleting package' });
  }
};
