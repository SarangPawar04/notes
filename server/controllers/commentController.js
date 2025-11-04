import Comment from "../models/comment.js";
import Note from "../models/note.js";

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const content = text;
    const { noteId } = req.params;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    const comment = await Comment.create({
      noteId,
      userId: req.user.id,
      content,
    });

    res.status(201).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { noteId } = req.params;
    const comments = await Comment.find({ noteId })
      .populate("userId", "userName email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
