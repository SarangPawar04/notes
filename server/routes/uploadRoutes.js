import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'NoteGram_Files',
        resource_type: 'auto', // This will allow uploading any type of file
    },
});

const upload = multer({ storage });

// route to upload a file 

// router.post("/", verifyToken, upload.single("file"), (req, res) =>{
//     res.status(200).json({
//         success : true,
//         message : "File uploaded successfully",
//         FileUrl : req.file.path,
//     });
// });

router.post("/", verifyToken, upload.single("file"), (req, res) => {
  console.log("REQ FILE:", req.file);
  res.status(200).json({
    success: true,
    message: "File uploaded successfully",
    fileUrl: req.file?.path || "No file path",
  });
});


export default router;
