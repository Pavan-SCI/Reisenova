import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';

let bucket = null;
let adminApp = null;

try {
  // Read service account from the path specified in .env
  const envPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ? path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH) : null;
  const pathsToCheck = [
    envPath,
    path.resolve(process.cwd(), 'serviceAccountKey.json'),
    path.resolve(process.cwd(), 'firebase-service-account.json')
  ].filter(Boolean);

  let serviceAccountPath = null;
  for (const p of pathsToCheck) {
    if (fs.existsSync(p)) {
      serviceAccountPath = p;
      break;
    }
  }

  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
    
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: 'reisenova-d0154.firebasestorage.app'
    });

    bucket = getStorage(adminApp).bucket();
    console.log("Firebase Admin SDK Initialized Successfully on Backend");
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT_PATH is not set or file does not exist. Firebase Admin SDK not initialized.");
  }
} catch (error) {
  console.error("Firebase Admin Initialization Error:", error.message, error.stack);
}

export { adminApp, bucket };
