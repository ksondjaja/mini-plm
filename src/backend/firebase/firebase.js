// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACJs-jXef_dRaeM6lCy7QLC9-lv6sItfo",
  authDomain: "mini-plm.firebaseapp.com",
  projectId: "mini-plm",
  storageBucket: "mini-plm.appspot.com",
  messagingSenderId: "321713285562",
  appId: "1:321713285562:web:13ecbc8220fb3f9e911583",
  measurementId: "G-S73DKD1T6W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;