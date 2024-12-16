// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, getAuthProvider, GoogleAuthProvider} from "firebase/auth"
import {getFirestore, doc, setDoc} from "firebase/firestore"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDi-zWJqWgL0Q_yTfbK3YKjTgzpUEvBL54",
  authDomain: "financely-personaltracker.firebaseapp.com",
  projectId: "financely-personaltracker",
  storageBucket: "financely-personaltracker.appspot.com",
  messagingSenderId: "113695143747",
  appId: "1:113695143747:web:3288a1be82901c24bfe1f6",
  measurementId: "G-9WYZGW6JNB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app);
const auth=getAuth(app);
const provider= new GoogleAuthProvider();
export{db, auth, provider, doc, setDoc};