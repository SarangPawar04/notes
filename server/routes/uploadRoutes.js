import express from "express";
import multer from "multer";
import verifyToken from "../middleware/authMiddleware.js";
import { supabase } from "../supabaseClient.js";
import sharp from "sharp";
import fetch from 'node-fetch';
import { PDFDocument } from 'pdf-lib';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { generatePdfThumbnail } from '../utils/pdfThumbnail.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const { title, description, category, userId } = req.body;
    const bucketName = "notes";

    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    console.log("Uploading file:", file.originalname);

    // 1️⃣ Upload PDF to Supabase
    const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError.message);
      return res.status(500).json({ success: false, message: uploadError.message });
    }

    // ✅ Get public URL for PDF
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    const fileUrl = publicUrlData?.publicUrl;
    if (!fileUrl) throw new Error("Failed to generate public URL");
    console.log("File uploaded to:", fileUrl);

    // 2️⃣ Generate thumbnail (first page only)
    let thumbnailUrl = null;
    try {
      console.log("Starting thumbnail generation...");
      
      // 1. Download the PDF
      console.log("Downloading PDF from:", fileUrl);
      const pdfResponse = await fetch(fileUrl);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to fetch PDF: ${pdfResponse.status} ${pdfResponse.statusText}`);
      }
      console.log("PDF downloaded successfully");

      const pdfBuffer = await pdfResponse.arrayBuffer();
      
      console.log("Generating thumbnail from first page...");
      
      // 2. Generate thumbnail using pdf.js and canvas
      const thumbnailBuffer = await generatePdfThumbnail(pdfBuffer, {
        width: 600,
        height: 800,
        pageNumber: 1,
        format: 'jpeg',
        quality: 0.9
      });
      
      if (!thumbnailBuffer || thumbnailBuffer.length === 0) {
        throw new Error('Generated thumbnail is empty');
      }
      
      console.log("Thumbnail generated successfully, size:", thumbnailBuffer.length, 'bytes');
      
      // 3. Upload to Supabase
      const thumbName = `thumb_${Date.now()}.jpg`;
      console.log("Uploading thumbnail to Supabase...");
      
      const { error: thumbError } = await supabase.storage
        .from(bucketName)
        .upload(thumbName, thumbnailBuffer, { 
          contentType: "image/jpeg",
          cacheControl: '3600',
          upsert: false
        });
        
      if (thumbError) throw thumbError;
      
      // 4. Get public URL
      const { data: thumbUrlData } = await supabase.storage
        .from(bucketName)
        .getPublicUrl(thumbName);
      
      thumbnailUrl = thumbUrlData?.publicUrl;
      console.log("Thumbnail URL generated:", thumbnailUrl);

      if (thumbError) throw thumbError;
      
      // 5. Get public URL
      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from(bucketName)
        .getPublicUrl(thumbName);
        
      if (publicUrlError) throw publicUrlError;
      
      thumbnailUrl = publicUrlData?.publicUrl;
      console.log("Thumbnail URL generated:", thumbnailUrl);
      
    } catch (thumbErr) {
      console.error("❌ Thumbnail generation failed:", thumbErr);
      console.error("Error details:", {
        message: thumbErr.message,
        stack: thumbErr.stack,
        name: thumbErr.name
      });
    }

    // 3️⃣ Return URLs
    const response = {
      success: true,
      message: "File uploaded successfully",
      fileUrl,
      thumbnailUrl,
    };
    
    console.log('Sending response:', JSON.stringify(response, null, 2));
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in file upload:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    const errorResponse = {
      success: false,
      message: "Error uploading file",
      error: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred during file upload'
    };
    
    console.error('Sending error response:', JSON.stringify(errorResponse, null, 2));
    res.status(500).json(errorResponse);
  }
});

export default router;
