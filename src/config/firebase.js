// =====================================================
// FIREBASE CONFIGURATION
// Matches ESP32 firmware config from kode.c++
// =====================================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase init error:", error);
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      document.body.innerHTML = `<div style="color:red; padding:20px; font-family:sans-serif;">
        <h2>Firebase Initialization Error</h2>
        <pre>${error.stack || error.message || String(error)}</pre>
        <p>Check your .env.local file configuration.</p>
      </div>`;
    }, 1000);
  }
}


export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
