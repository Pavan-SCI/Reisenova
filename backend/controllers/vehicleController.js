import { db } from '../config/firebase.js';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export const getVehicles = async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database service unavailable.' });
    const snapshot = await getDocs(query(collection(db, 'vehicles'), orderBy('createdAt', 'desc')));
    const vehicles = [];
    snapshot.forEach(docSnap => {
      vehicles.push({ id: docSnap.id, ...docSnap.data() });
    });
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Server error fetching vehicles' });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!db) return res.status(503).json({ error: 'Database service unavailable.' });
    const vehicleRef = doc(db, 'vehicles', id);
    const vehicleDoc = await getDoc(vehicleRef);
    if (!vehicleDoc.exists()) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.status(200).json({ id: vehicleDoc.id, ...vehicleDoc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const { name, type, seats, price, image, images, description, features } = req.body;
    if (!name || !type) return res.status(400).json({ error: 'Name and Type are required' });
    if (!db) return res.status(503).json({ error: 'Database service unavailable.' });
    const vehicleData = {
      name, type, seats: seats || 4, price: price || '', image: image || '', images: images || (image ? [image] : []), description: description || '', features: features || [], withGuide: req.body.withGuide || false, 
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'vehicles'), vehicleData);
    res.status(201).json({ success: true, vehicle: { id: docRef.id, ...vehicleData } });
  } catch (error) {
    res.status(500).json({ error: 'Server error creating vehicle' });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!db) return res.status(503).json({ error: 'Database service unavailable.' });
    const vehicleRef = doc(db, 'vehicles', id);
    const vehicleDoc = await getDoc(vehicleRef);
    if (!vehicleDoc.exists()) return res.status(404).json({ error: 'Vehicle not found' });
    const updatedData = { ...req.body, updatedAt: new Date().toISOString() };
    await updateDoc(vehicleRef, updatedData);
    res.status(200).json({ success: true, vehicle: { id, ...vehicleDoc.data(), ...updatedData } });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating vehicle' });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!db) return res.status(503).json({ error: 'Database service unavailable.' });
    const vehicleRef = doc(db, 'vehicles', id);
    await deleteDoc(vehicleRef);
    res.status(200).json({ success: true, message: 'Vehicle deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting vehicle' });
  }
};
