import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBzuMziYfsSoP0I3UGqnnNNz717OBZUw2k",
  authDomain: "freshmart-da486.firebaseapp.com",
  databaseURL: "https://freshmart-da486-default-rtdb.firebaseio.com",
  projectId: "freshmart-da486",
  storageBucket: "freshmart-da486.firebasestorage.app",
  messagingSenderId: "114626089771",
  appId: "1:114626089771:web:254736f1ac49a9c5062b6e",
  measurementId: "G-G6HP3GN6H8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
