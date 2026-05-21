// =====================================================
// FIREBASE CONFIGURATION
// Matches ESP32 firmware config from kode.c++
// =====================================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
apiKey: "[REMOVED-FIREBASE-APIKEY]",
  authDomain: "iot-energy-meter-45051.firebaseapp.com",
  databaseURL: "https://iot-energy-meter-45051-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot-energy-meter-45051",
  storageBucket: "iot-energy-meter-45051.firebasestorage.app",
  messagingSenderId: "749284219456",
  appId: "1:749284219456:web:04711d67bf8267aca51da5",
  measurementId: "G-FTVFKBLRVX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
