import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Checks if the user has a phone number in localStorage or Firestore.
 * Returns the phone number if found, or null otherwise.
 */
export const checkAndGetUserPhone = async (userId: string): Promise<string | null> => {
  // 1. Check local storage
  const cached = localStorage.getItem('userPhone');
  if (cached) return cached;
  
  if (!userId) return null;
  
  // 2. Check Firestore
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      if (data.phone) {
        localStorage.setItem('userPhone', data.phone);
        return data.phone;
      }
    }
  } catch (err) {
    console.error('Error fetching user phone from Firestore:', err);
  }
  
  return null;
};
