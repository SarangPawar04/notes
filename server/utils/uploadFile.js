import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from 'fs/promises';

dotenv.config();

const BUCKET_NAME = process.env.SUPABASE_BUCKET || 'notes';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false
    }
  }
);

// Helper function to handle file reading
const getFileBuffer = async (file) => {
  try {
    if (file.buffer) {
      return file.buffer;
    } else if (file.path) {
      return await fs.readFile(file.path);
    }
    throw new Error('No valid file data found');
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
};

export const uploadFile = async (file) => {
  try {
    console.log('Starting file upload...');
    
    if (!file) {
      throw new Error("No file received in uploadFile");
    }

    console.log('File metadata:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      hasBuffer: !!file.buffer,
      hasPath: !!file.path
    });

    const fileBuffer = await getFileBuffer(file);
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('File buffer is empty');
    }

    const fileName = `notes/${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
    console.log(`Uploading to bucket: ${BUCKET_NAME}, file: ${fileName}`);

    // First, ensure the bucket exists
    try {
      console.log('Checking bucket access...');
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.warn('Error listing buckets (might not have permissions):', listError);
      } else {
        const bucketExists = buckets.some(b => b.name === BUCKET_NAME);
        console.log(`Bucket '${BUCKET_NAME}' exists:`, bucketExists);
      }
    } catch (bucketCheckError) {
      console.warn('Could not verify bucket existence:', bucketCheckError);
    }

    // Upload the file
    console.log('Starting file upload to Supabase...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log('Upload successful, getting public URL...');
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    if (!publicUrl) {
      throw new Error('Failed to generate public URL');
    }

    console.log('File uploaded successfully. Public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('File upload failed:', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
};
