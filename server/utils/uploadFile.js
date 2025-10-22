import cloudinary from '../config/cloudinary.js';

export const uploadFile = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'notes', // optional
    });
    return result.secure_url; // Cloudinary's file URL
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};
