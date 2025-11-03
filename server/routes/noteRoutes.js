import express from 'express';
import multer from 'multer';
import verifyToken from '../middleware/authMiddleware.js';
import { createNote, getAllNotes, getNoteById, addComment, rateNote, deleteNote } from '../controllers/noteController.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

//create a new note 
router.post("/create", verifyToken ,upload.single('file'), createNote);

//get all notes (public)
router.get("/", getAllNotes);

//get single note by id (public)
router.get("/:id", getNoteById);

//add comment to a note
router.post("/:id/comment", verifyToken, addComment);

//rate note 
router.post("/:id/rate", verifyToken, rateNote);

//delete note
router.delete("/:id", verifyToken, deleteNote);


export default router;
