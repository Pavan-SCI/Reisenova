import { db } from '../config/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const getSettings = async (req, res) => {
  try {
    const docRef = doc(db, 'settings', 'general');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(200).json({});
    }
    res.status(200).json(docSnap.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const data = req.body;
    const docRef = doc(db, 'settings', 'general');
    await setDoc(docRef, data, { merge: true });
    res.status(200).json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
