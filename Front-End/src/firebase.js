import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBA1KPpMUywwzkY4gKcdERPtUGkaDTEHdc",
  authDomain: "userregistration-d413c.firebaseapp.com",
  projectId: "userregistration-d413c",
  storageBucket: "userregistration-d413c.firebasestorage.app",
  messagingSenderId: "598432263309",
  appId: "1:598432263309:web:d39411796dc779461e86c4",
  measurementId: "G-1B5F1J1VC3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };