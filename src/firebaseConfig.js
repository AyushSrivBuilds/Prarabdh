// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // Optional: if you want to use Firebase Analytics
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions"; // Optional: if you plan to call functions from client

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABnFyItGMtijZuCJHOuIzrK9yaKYX95Lc",
  authDomain: "prarabdha-4f2ae.firebaseapp.com",
  projectId: "prarabdha-4f2ae",
  storageBucket: "prarabdha-4f2ae.firebasestorage.app",
  messagingSenderId: "834175996738",
  appId: "1:834175996738:web:e687691eaa416da88beedb",
  measurementId: "G-22Y28H8QGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
const analytics = getAnalytics(app); // Optional
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app); // Optional

export { app, analytics, auth, db, storage, functions };