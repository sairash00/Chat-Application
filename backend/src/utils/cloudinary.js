import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_CLOUDINARY,
});

export const uploadOnCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' }, // Automatically determine resource type
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          return reject(error);
        }
        resolve(result.secure_url); // Return the secure URL after a successful upload
      }
    );

    // Send the buffer directly to the Cloudinary upload stream
    uploadStream.end(fileBuffer);
  });
};


export const removeFromCloudinary = async (url) => {
  try {
    if (url && !Array.isArray(url)) {
      url = [url];
    }
    const deletion = url.map((url) => {
      const publicId = url.split("/").slice(-1)[0].split(".")[0];
      return cloudinary.uploader.destroy(publicId);
    });

    const response = await Promise.all(deletion);
    return response;
  } catch (error) {
    console.error("error while deleting from cloudinary", error);
    return null;
  }
};