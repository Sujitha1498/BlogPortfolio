import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  apiKey: "AIzaSyDAJuswtt0OrSASkVu7m7NoZyfeE8T1huU",
  authDomain: "blogportfolio-9e0bb.firebaseapp.com",
  projectId: "blogportfolio-9e0bb",
  storageBucket: "blogportfolio-9e0bb.firebasestorage.app",
  messagingSenderId: "805489452527",
  appId: "1:805489452527:web:c12647e012bb4915eac21a",
  measurementId: "G-VTW5V8NXVT"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;