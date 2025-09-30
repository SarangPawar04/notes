import mongoose from 'mongoose';

const savedNoteSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",   
            required : true
        },
        noteId : {
            type : mongoose.Schema.Types.ObjectId, 
            ref : "Note",
            required : true
        },
    }, {timestamps : true}
);
export const SavedNote = mongoose.model("SavedNote", savedNoteSchema);