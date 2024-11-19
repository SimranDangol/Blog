import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-defcf.firebaseapp.com",
  projectId: "mern-blog-defcf",
  storageBucket: "mern-blog-defcf.appspot.com",
  messagingSenderId: "108215931183",
  appId: "1:108215931183:web:5a85e05d249d448062d1da",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
