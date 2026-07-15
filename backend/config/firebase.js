import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: "AIzaSyDZ87NMODp4qT7SsdswhpIdCY4-ZvLjJPM",
  authDomain: "reisenova-d0154.firebaseapp.com",
  projectId: "reisenova-d0154",
  storageBucket: "reisenova-d0154.firebasestorage.app",
};

let db = null;
let app = null;

try {
  app = initializeApp(config);
  db = getFirestore(app);
  console.log("Firebase Client SDK Initialized Successfully on Backend with reisenova-d0154");
} catch (error) {
  console.error("Firebase Initialization Error:", error.message, error.stack);
}

export { db, app };
