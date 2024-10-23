import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    console.log("Uploading to Cloudinary...");
    console.log("Local file path:", localFilePath);

    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("Cloudinary upload response:", response);

    fs.unlinkSync(localFilePath); // Clean up the local file
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("Cloudinary upload error:", error); // Improved error logging
    throw new Error("Failed to upload image");
  }
};
