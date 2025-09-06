// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTE6vl51hbJ-5wYbrtC1jWNh7VyWXHWjQ",
  authDomain: "biovault-e4f8e.firebaseapp.com",
  projectId: "biovault-e4f8e",
  storageBucket: "biovault-e4f8e.firebasestorage.app",
  messagingSenderId: "262076194404",
  appId: "1:262076194404:web:6cdda5be57f74044878971",
  measurementId: "G-ZL7FFXFFZW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);