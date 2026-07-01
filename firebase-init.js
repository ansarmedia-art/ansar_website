import { initializeApp } from 'firebase/app';
import { getAI, GoogleAIBackend } from 'firebase/ai';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyApBeUtd8i7VC6wpOSxjD1PPYjQEQBGQ4Y",
  authDomain: "ansar-english-school.firebaseapp.com",
  projectId: "ansar-english-school",
  storageBucket: "ansar-english-school.firebasestorage.app",
  messagingSenderId: "729617648651",
  appId: "1:729617648651:web:f5d90b86b9b387d86b0b0e",
  measurementId: "G-Y7YNPNVFP1"
};

export const app = initializeApp(firebaseConfig);
export const ai = getAI(app, { backend: new GoogleAIBackend() });
export const db = getFirestore(app);
export const auth = getAuth(app);

// Enable offline persistence for snappy navigation and FOUC prevention
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});
