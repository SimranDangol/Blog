// import { Button } from "@/components/ui/button";
// import logo from "@/assets/logo.png";
// import { signInSuccess } from "../redux/user/userSlice";
// import { useDispatch } from "react-redux";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { app } from "@/firebase.js";
// import { useNavigate } from "react-router-dom";

// const Oauth = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const auth = getAuth(app);

//   const handleClick = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       provider.setCustomParameters({ prompt: "select_account" });
//       const resultsFromGoogle = await signInWithPopup(auth, provider);

//       const profilePicture = resultsFromGoogle.user.photoURL;

//       const res = await fetch("/api/v1/auth/google", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: resultsFromGoogle.user.displayName,
//           email: resultsFromGoogle.user.email,
//           googlePhotoUrl: profilePicture,
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(
//           `HTTP error! status: ${res.status}, message: ${errorData.message}`
//         );
//       }
//       const data = await res.json();
//       dispatch(signInSuccess(data));
//       navigate("/");
//     } catch (error) {
//       console.error("Error during Google authentication:", error);
//     }
//   };

//   return (
//     <Button
//       variant="outline"
//       className="flex items-center justify-center w-full gap-2 py-5 mb-4 text-base text-gray-900 border border-gray-300 dark:text-white dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 md:text-lg"
//       type="button"
//       onClick={handleClick}
//     >
//       <img src={logo} alt="Google logo" className="w-5" />
//       Continue with Google
//     </Button>
//   );
// };

// export default Oauth;



import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { signInSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from "firebase/auth";
import { app } from "@/firebase.js";
import { useNavigate } from "react-router-dom";

const Oauth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);

  // Ensure session persistence is set
  const setFirebasePersistence = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence); // Ensure session persistence
    } catch (error) {
      console.error("Error setting persistence: ", error);
    }
  };

  const handleClick = async () => {
    try {
      await setFirebasePersistence(); // Set persistence before login
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      const profilePicture = resultsFromGoogle.user.photoURL;
      const res = await fetch("/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: profilePicture,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`HTTP error! status: ${res.status}, message: ${errorData.message}`);
      }

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.error("Error during Google authentication:", error);
    }
  };

  return (
    <Button
      variant="outline"
      className="flex items-center justify-center w-full gap-2 py-5 mb-4 text-base text-gray-900 border border-gray-300 dark:text-white dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 md:text-lg"
      type="button"
      onClick={handleClick}
    >
      <img src={logo} alt="Google logo" className="w-5" />
      Continue with Google
    </Button>
  );
};

export default Oauth;
