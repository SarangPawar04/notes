import { SavedNote } from "../models/savednotes.js";
import Note from "../models/note.js";

export const saveNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { noteId } = req.params;

        // ensure note exists
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        // prevent duplicates
        const existing = await SavedNote.findOne({ userId, noteId });
        if (existing) {
            return res.status(200).json({ success: true, message: "Already saved" });
        }

        const saved = await SavedNote.create({ userId, noteId });
        return res.status(201).json({ success: true, message: "Note saved", saved });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const unsaveNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { noteId } = req.params;

        const deleted = await SavedNote.findOneAndDelete({ userId, noteId });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Saved note not found" });
        }
        return res.status(200).json({ success: true, message: "Note unsaved" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getSavedNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const saved = await SavedNote.find({ userId })
            .sort({ createdAt: -1 })
            .populate({ path: "noteId", populate: { path: "uploaderID", select: "userName email" } });

        // shape response: list of populated notes
        const notes = saved
            .map((s) => s.noteId)
            .filter(Boolean);

        return res.status(200).json({ success: true, count: notes.length, notes });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


