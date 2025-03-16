import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBA1KPpMUywwzkY4gKcdERPtUGkaDTEHdc",
  authDomain: "userregistration-d413c.firebaseapp.com",
  projectId: "userregistration-d413c",
  storageBucket: "userregistration-d413c.firebasestorage.app",
  messagingSenderId: "598432263309",
  appId: "1:598432263309:web:975dbeeff2a818741e86c4",
  measurementId: "G-LMTQN037BD"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);

export { auth };

