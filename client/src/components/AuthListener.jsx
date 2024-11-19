import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { signInSuccess, signOutSuccess } from "../redux/user/userSlice";
import axios from "axios";
import { app } from "@/firebase.js";

const auth = getAuth(app);

const AuthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch additional user data from the backend
          const res = await axios.post("/api/v1/auth/google", {
            email: user.email,
            name: user.displayName,
            googlePhotoUrl: user.photoURL,
          });
          if (res.status === 200) {
            dispatch(signInSuccess(res.data.data)); // Save full user info
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        dispatch(signOutSuccess());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
};

export default AuthListener;
