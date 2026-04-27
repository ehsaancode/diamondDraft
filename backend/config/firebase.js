import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

let bucket = null;
let db = null;

if (!process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PRIVATE_KEY?.includes('YOUR_KEY_HERE')) {
  console.warn('WARNING: Firebase configuration is missing or invalid in .env! Image uploads to Firebase will fail until you provide a valid Service Account.');
} else {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    bucket = admin.storage().bucket();
    db = admin.firestore();
    db.settings({ ignoreUndefinedProperties: true });
    console.log('Firebase Admin Initialized.');
  } catch (err) {
    console.error('Firebase Admin Initialization Error:', err.message);
  }
}

export { admin, bucket, db };
