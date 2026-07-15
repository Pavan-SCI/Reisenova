import dotenv from 'dotenv';
dotenv.config();
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
const app = initializeApp({ credential: cert(serviceAccount) });
try {
  const db = getFirestore(app, "test-db");
  console.log("DB initialized:", db !== null);
} catch (e) {
  console.log("Error:", e.message);
}
