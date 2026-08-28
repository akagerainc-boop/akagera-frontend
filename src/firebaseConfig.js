import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Values come from env (REACT_APP_FIREBASE_*) with the project defaults as fallback.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyBIRIMAzyx76nUktVo--HCWMjUsV8smRys',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'ussd-1-9aa3a.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'ussd-1-9aa3a',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'ussd-1-9aa3a.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '133100715006',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:133100715006:web:f347d4296f1e0b3beadeaf',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
