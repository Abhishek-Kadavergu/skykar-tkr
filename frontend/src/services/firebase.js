import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';

// Firebase configuration
// Get values from environment variables
// IMPORTANT: Update the .env file with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Authentication Functions

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

export const signUpWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Firestore Functions

export const saveUserPreferences = async (userId, preferences) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      preferences,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving preferences:", error);
    // Don't throw - system should work even if Firestore fails
    return false;
  }
};

export const getUserPreferences = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data().preferences;
    }
    return null;
  } catch (error) {
    console.error("Error getting preferences:", error);
    return null;
  }
};

export const saveRecommendationHistory = async (userId, recommendations) => {
  try {
    const historyRef = collection(db, 'users', userId, 'history');
    await addDoc(historyRef, recommendations);
    console.log("Successfully saved to Firestore history collection");
    return true;
  } catch (error) {
    console.error("Error saving history:", error);
    return false;
  }
};

export const getRecommendationHistory = async (userId) => {
  try {
    const historyRef = collection(db, 'users', userId, 'history');
    const q = query(historyRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const history = [];
    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log("Loaded history from Firestore:", history.length, "entries");
    return history;
  } catch (error) {
    console.error("Error getting history:", error);
    return [];
  }
};

export { auth, db };
