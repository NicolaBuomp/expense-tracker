import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCK4jWDfpUmYbyS0F6wtmiePJqTMH2MZVA",
  authDomain: "expense-tracker-dd744.firebaseapp.com",
  projectId: "expense-tracker-dd744",
  storageBucket: "expense-tracker-dd744.appspot.com",
  messagingSenderId: "154892471119",
  appId: "1:154892471119:web:7ef9ef92aed61d864b933a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };