// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app"; //v10
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const apiKey = process.env.VUE_APP_FIREBASE_AUTH_API_KEY;
const messagingSenderId = process.env.VUE_APP_FIREBASE_AUTH_MESSAGING_SENDER_ID;
const appId = process.env.VUE_APP_FIREBASE_AUTH_APP_ID;
const measurementId = process.env.VUE_APP_FIREBASE_AUTH_MEASUREMENT_ID;


const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "mini-plm.firebaseapp.com",
  projectId: "mini-plm",
  storageBucket: "mini-plm.appspot.com",
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, analytics };