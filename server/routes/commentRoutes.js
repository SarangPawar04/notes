import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { addComment, getComments } from "../controllers/commentController.js";
console.log("🟢 commentRoutes loaded");


const router = express.Router();

// ✅ Add a comment to a note
router.post("/:noteId", verifyToken, addComment);
// ✅ Get all comments for a note
router.get("/:noteId", getComments);


// router.post("/:id", verifyToken, addComment);
// router.get("/:id", getComments);

export default router;
