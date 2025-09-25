import mongoose from 'mongoose';
const ratingSchema = new mongoose.Schema(
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
        ratingValue : {
            type : Number,
            required : true,
            min : 1,
            max : 5 
        },
    },{timestamps : true}
);

export const Rating = mongoose.model("Rating", ratingSchema);