import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "User registered successfully", createdUser));
});

export const generateRefreshandAccessTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken; // Store refresh token in the database
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordMatch = await user.isPasswordCorrect(password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Incorrect password");
  }

  const { accessToken, refreshToken } = await generateRefreshandAccessTokens(
    user._id
  );

  // COOKIE
  const options = {
    httpOnly: true,
    secure: true,
  };

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User logged in Successfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

export const google = asyncHandler(async (req, res) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      user.profilePicture = googlePhotoUrl;
      await user.save();
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      user = new User({
        fullName: name,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await user.save();
    }

    const { accessToken, refreshToken } = await generateRefreshandAccessTokens(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      sameSite: 'strict'
    };

    const { password, refreshToken: _, ...userData } = user.toObject();

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            ...userData,
          },
          "User authenticated successfully via Google"
        )
      );
  } catch (error) {
    console.error("Error during Google authentication:", error);
    return res
      .status(400)
      .json(new ApiError(400, error.message || "Something went wrong"));
  }
});

export const logout = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  // Remove the refresh token from the user's document in the database
  await User.findByIdAndUpdate(_id, {
    $unset: { refreshToken: 1 },
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  // Clear the access and refresh token cookies
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});


export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
      sameSite: 'strict'
    };

    const { accessToken, refreshToken } = await generateRefreshandAccessTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});








