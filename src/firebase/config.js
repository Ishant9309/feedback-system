import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCw6NalYhv80n2IqV8HBVnx2Jb0JiMh1EY",
  authDomain: "feedback-form-5a390.firebaseapp.com",
  projectId: "feedback-form-5a390",
  storageBucket: "feedback-form-5a390.firebasestorage.app",
  messagingSenderId: "464062632671",
  appId: "1:464062632671:web:3e2151bc00dcb34e200f6a"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);