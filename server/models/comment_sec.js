import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema (
    {
        noteId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Note",
            required : true 
        },
        userId : {
            type : mongoose.Schema.Types.ObjectId, 
            ref : "User",
            required : true
        },
        commentText : {
            type : String,
            required : true,
            maxLength : 500,    
        },
    },{timestamps : true}
);

export const Comment = mongoose.model("Comment", commentSchema);