import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3i2b3PmWpRFvW23oVt5Z7vZ71CRIjsfg",
  authDomain: "careerlens-e79c7.firebaseapp.com",
  projectId: "careerlens-e79c7",
  storageBucket: "careerlens-e79c7.appspot.com",
  messagingSenderId: "565792766652",
  appId: "1:565792766652:web:47ad66f2792e615d70eeb9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Firebase Auth
export const auth = getAuth(app);

// 🔵 Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
