import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
};

// Only apply config if keys are present (removes reliance on implicit CLOUDINARY_URL behavior)
if (cloudinaryConfig.cloud_name && cloudinaryConfig.api_key && cloudinaryConfig.api_secret) {
    cloudinary.config(cloudinaryConfig);
}

export default cloudinary;

const safeUnlink = (p) => {
    try { if (p && fs.existsSync(p)) fs.unlinkSync(p); } catch { }
};

export const uploadOnCloudinary = async (filePath) => {
    if (!filePath) return null;
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });
        return result;
    } finally {
        safeUnlink(filePath); // cleanup temp file regardless of success/failure
    }
};
