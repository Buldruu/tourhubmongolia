import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID
);

if (!isFirebaseConfigured) {
  // eslint-disable-next-line no-console
  console.error(
    'TourHub: VITE_FIREBASE_* хувьсагчид тохируулагдаагүй байна! ' +
      'Локалд .env файлаа, GitHub Pages дээр бол repo Secrets-ээ шалгана уу.'
  );
}

// Placeholder fallbacks: getAuth() throws synchronously (white screen!) when
// apiKey is empty, so keep init alive and surface errors gracefully instead.
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'missing-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'missing.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'missing-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'missing.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '0',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '0:0:web:0'
};

const app = initializeApp(config);
export const db = getFirestore(app);
export const auth = getAuth(app);
