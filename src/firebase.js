import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAa5gqPTc9NKFe56ERU6dgs-f2mMBS7LDg",
  authDomain: "gp-hu-42ca5.firebaseapp.com",
  projectId: "gp-hu-42ca5",
  storageBucket: "gp-hu-42ca5.firebasestorage.app",
  messagingSenderId: "534136329926",
  appId: "1:534136329926:web:882f020f61a10adc5169c7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();