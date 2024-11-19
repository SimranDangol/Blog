// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { toast } from "sonner";
// import { AiOutlineLogout } from "react-icons/ai";
// import { Card } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { signOutStart, signOutSuccess, signOutFailure } from "@/redux/user/userSlice";
// import axios from "axios";

// const Profile = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { currentUser } = useSelector((state) => state.user);
//   const userData = currentUser?.data || {};

//   const handleLogout = async () => {
//     try {
//       dispatch(signOutStart());
//       const res = await axios.post("/api/v1/auth/logout");
//       dispatch(signOutSuccess(res.data));
//       toast.success("Logged out successfully");
//       navigate("/login");
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to logout. Please try again.");
//       dispatch(signOutFailure());
//     }
//   };

//   useEffect(() => {
//     if (!currentUser) {
//       toast.error("User not found. Please log in.");
//       navigate("/login");
//     }
//   }, [currentUser, navigate]);

//   // Fallback image URL when the user doesn't have a profile picture
//   const fallbackImageUrl = "https://www.example.com/default-profile-image.jpg"; // Replace with your default image URL

//   return (
//     <div className="flex justify-center py-12">
//       <Card className="w-full max-w-md p-6">
//         <h2 className="mb-4 text-2xl font-bold text-center">Profile</h2>
        
//         <div className="flex flex-col items-center mb-4">
//           <Avatar className="w-24 h-24">
//             {userData.profilePicture ? (
//               <AvatarImage 
//                 src={userData.profilePicture || fallbackImageUrl} 
//                 alt="Profile Picture" 
//               />
//             ) : (
//               <AvatarFallback className="text-lg font-medium">
//                 {/* Default fallback text without using initials */}
//                 {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : "U"}
//               </AvatarFallback>
//             )}
//           </Avatar>
//           <div className="mt-4">
//             <p className="text-lg font-semibold">{userData.fullName || "User"}</p>
//             <p className="text-sm text-gray-500">{userData.email}</p>
//           </div>
//         </div>

//         <Button onClick={handleLogout} className="w-full mt-4 bg-red-500">
//           <AiOutlineLogout className="mr-2" />
//           Logout
//         </Button>
//       </Card>
//     </div>
//   );
// };

// export default Profile;

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { AiOutlineLogout } from "react-icons/ai";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { signOutStart, signOutSuccess, signOutFailure } from "@/redux/user/userSlice";
import axios from "axios";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const userData = currentUser?.data || {};

  const handleLogout = async () => {
    try {
      dispatch(signOutStart());
      const res = await axios.post("/api/v1/auth/logout");
      dispatch(signOutSuccess(res.data));
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout. Please try again.");
      dispatch(signOutFailure());
    }
  };

  useEffect(() => {
    if (!currentUser) {
      toast.error("User not found. Please log in.");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Function to generate initials from full name
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return "U";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

  // Debug log to check userData
  console.log("userData:", userData);
  console.log("fullName:", userData.fullName);
  console.log("initials:", getInitials(userData.fullName));

  return (
    <div className="flex justify-center py-12">
      <Card className="w-full max-w-md p-6">
        <h2 className="mb-4 text-2xl font-bold text-center">Profile</h2>
        
        <div className="flex flex-col items-center mb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={userData.profilePicture}
              alt="Profile Picture"
            />
            <AvatarFallback 
              className="text-lg font-semibold bg-slate-100 text-slate-900"
              delayMs={600}
            >
              {getInitials(userData.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4">
            <p className="text-lg font-semibold">{userData.fullName || "User"}</p>
            <p className="text-sm text-gray-500">{userData.email || "No email provided"}</p>
          </div>
        </div>

        <Button 
          onClick={handleLogout} 
          variant="destructive" 
          className="w-full mt-4"
        >
          <AiOutlineLogout className="mr-2" />
          Logout
        </Button>
      </Card>
    </div>
  );
};

export default Profile;