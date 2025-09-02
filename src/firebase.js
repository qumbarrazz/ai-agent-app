// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBtYF2DZG56oNDDXbNJ_55puFhqi9-Q4xk",
  authDomain: "generic-ai-agents.firebaseapp.com",
  projectId: "generic-ai-agents",
  storageBucket: "generic-ai-agents.firebasestorage.app",
  messagingSenderId: "6540400019",
  appId: "1:6540400019:web:70ccd1abfb8293292c0466",
  measurementId: "G-DW7DWVJZC5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
