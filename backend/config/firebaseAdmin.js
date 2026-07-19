import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';

let bucket = null;
let adminApp = null;

try {
  let serviceAccount = null;

  // 1. Try to load from environment variable (Best for Vercel)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } else {
    // 2. Fallback to local file path (Best for local dev)
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
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
    }
  }

  if (serviceAccount) {
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: 'reisenova-d0154.firebasestorage.app'
    });

    bucket = getStorage(adminApp).bucket();
    console.log("Firebase Admin SDK Initialized Successfully on Backend");
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT_JSON or PATH is not set. Firebase Admin SDK not initialized.");
  }
} catch (error) {
  console.error("Firebase Admin Initialization Error:", error.message, error.stack);
}

export { adminApp, bucket };
