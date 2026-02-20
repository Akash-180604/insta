// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "instaauth-33e66.firebaseapp.com",
  projectId: "instaauth-33e66",
  storageBucket: "instaauth-33e66.firebasestorage.app",
  messagingSenderId: "604128672322",
  appId: "1:604128672322:web:a51eb50355bc5a57bbcbdb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider}