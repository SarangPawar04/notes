import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { saveNote, unsaveNote, getSavedNotes } from '../controllers/savedNoteController.js';

const router = express.Router();

// get all saved notes for current user
router.get('/', verifyToken, getSavedNotes);

// save a note
router.post('/:noteId', verifyToken, saveNote);

// unsave a note
router.delete('/:noteId', verifyToken, unsaveNote);

export default router;


