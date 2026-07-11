const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();

let db = null;
let app = null;

try {
  let serviceAccount;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const path = require('path');
    const fullPath = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    serviceAccount = require(fullPath);
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  if (serviceAccount) {
    app = initializeApp({
      credential: cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized Successfully");
    db = getFirestore(app);
  } else {
    console.warn("⚠️  Firebase Service Account not found. Database features will fail until configured.");
    console.warn("👉  Please follow the steps in walkthrough.md to get the service account key.");
  }
} catch (error) {
  console.error("Firebase Initialization Error:", error.message);
}

module.exports = { db };
