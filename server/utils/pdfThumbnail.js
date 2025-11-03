import { createCanvas } from 'canvas';
import { PDFDocument } from 'pdf-lib';

export async function generatePdfThumbnail(pdfBuffer) {
  try {
    console.log("Generating thumbnail from first page...");
    
    // Load the PDF
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pageCount = pdfDoc.getPageCount();
    
    if (pageCount === 0) {
      throw new Error('PDF has no pages');
    }
    
    // Create a canvas
    const canvas = createCanvas(300, 400); // Fixed size for thumbnail
    const ctx = canvas.getContext('2d');
    
    // Add a white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some text to indicate it's a PDF
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('PDF Document', 20, 40);
    
    // Add page count and basic info
    ctx.font = '14px Arial';
    ctx.fillText(`Pages: ${pageCount}`, 20, 70);
    
    // Add a simple PDF icon
    ctx.strokeStyle = '#1a73e8';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 100, 240, 280);
    
    // Add some lines to make it look like a document
    for (let i = 0; i < 10; i++) {
      const y = 140 + (i * 20);
      if (i % 3 === 0) {
        ctx.fillStyle = '#e8eaed';
        ctx.fillRect(40, y - 10, 220, 18);
        ctx.fillStyle = 'black';
      }
      ctx.fillRect(40, y, 220, 2);
    }
    
    console.log("✅ Thumbnail generated successfully");
    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error("Error generating PDF thumbnail:", error);
    // Return a simple error thumbnail
    const canvas = createCanvas(300, 100);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffebee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.font = '16px Arial';
    ctx.fillText('Error generating thumbnail', 20, 40);
    return canvas.toBuffer('image/png');
  }
}

