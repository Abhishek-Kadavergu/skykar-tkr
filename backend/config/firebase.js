import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

let db = null;

/**
 * Initialize Firebase Admin SDK
 * Requires serviceAccountKey.json in project root
 */
export const initializeFirebase = () => {
  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
    
    // Check if already initialized
    if (admin.apps.length > 0) {
      console.log('Firebase Admin already initialized ✅');
      db = admin.firestore();
      return db;
    }

    // Read service account key
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    db = admin.firestore();
    console.log('Firebase Admin initialized successfully ✅');
    
    return db;
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    console.warn('⚠️  Running without Firebase Admin. Download serviceAccountKey.json from Firebase Console.');
    return null;
  }
};

/**
 * Get Firestore database instance
 */
export const getDb = () => {
  if (!db) {
    db = initializeFirebase();
  }
  return db;
};

/**
 * Firestore timestamp helpers
 */
export const FieldValue = admin.firestore.FieldValue;
export const Timestamp = admin.firestore.Timestamp;

export default { initializeFirebase, getDb, FieldValue, Timestamp };
