// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { EmailAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAbK0DDQB7dMl7LpPCFmzEvtrTHJYw6UE",
  authDomain: "examregsystem.firebaseapp.com",
  projectId: "examregsystem",
  storageBucket: "examregsystem.appspot.com",
  messagingSenderId: "92530767588",
  appId: "1:92530767588:web:2b3cd93ccb5e30893f9ef1"
};

// Initialize Firebase

let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const provider = new EmailAuthProvider();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, provider };
export default app;