import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const config = {
  apiKey: "AIzaSyDZ87NMODp4qT7SsdswhpIdCY4-ZvLjJPM",
  authDomain: "reisenova-d0154.firebaseapp.com",
  projectId: "reisenova-d0154",
  storageBucket: "reisenova-d0154.firebasestorage.app",
};

const app = initializeApp(config);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
