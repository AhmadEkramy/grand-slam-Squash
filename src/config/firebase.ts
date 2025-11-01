

// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration (updated)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcubztUwOgf1m9v1ePjR6V1Hh0yPrSP2I",
  authDomain: "squash-grand-slam-6a9c0.firebaseapp.com",
  projectId: "squash-grand-slam-6a9c0",
  storageBucket: "squash-grand-slam-6a9c0.firebasestorage.app",
  messagingSenderId: "944491046873",
  appId: "1:944491046873:web:6434d3991a7957da8e9bc8",
  measurementId: "G-EJS0S8DVHP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Export the raw config so callers can log/inspect which project the client is pointed at
export { firebaseConfig };

  export { analytics, app, auth, db };

