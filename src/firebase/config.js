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
  apiKey: "AIzaSyCPGRmdBHtFvpTwmT5VuuyIOx5Cbou5JOY",
  authDomain: "react-ecommerce-80107.firebaseapp.com",
  projectId: "react-ecommerce-80107",
  storageBucket: "react-ecommerce-80107.firebasestorage.app",
  messagingSenderId: "7616572856",
  appId: "1:7616572856:web:b39420f0fdd003e921b34d",
  measurementId: "G-ZG3Y0NZQ8F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
// export const db = getFirestore(app);
export const db = getFirestore(app);
