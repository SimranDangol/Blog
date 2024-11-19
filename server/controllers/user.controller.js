import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcryptjs";

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const file = req.file;
  let profilePicture;

  // If a file is uploaded, upload it to Cloudinary
  if (file) {
    const uploadResponse = await uploadOnCloudinary(file.path);
    profilePicture = uploadResponse.secure_url;
  }

  // Hashing the password if it is provided
  let hashedPassword;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  // Construct the fields to update based on provided data
  const updateFields = {
    ...(fullName && { fullName }),
    ...(email && { email }),
    ...(password && { password: hashedPassword }),
    ...(profilePicture && { profilePicture }),
  };

  const updatedUser = await User.findByIdAndUpdate(
    req.user?.id,
    { $set: updateFields },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile Updated Successfully", updatedUser));
});

export const getUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId); // Fetching user by ID

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});
