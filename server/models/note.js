//defineing note schema 

import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : true
        },
        description : {
            type : String,
        },
        fileUrl : {
            type : String,
            required : true
        },
        uploaderID :{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User", 
            required : true
        },
        category : {
            type : String,
            required : true,
            enum : ["Science", "Maths", "History", "Geography", "Literature", "Art", "Music", "Technology", "Other"],
        },
        ratings : {
            type : Number,
            default : 0,
            min : 0,
            max : 5,
        },
        comments :{
            type : string,
            default : "",
            maxLength : 500,
        },
    },{timestamps : true}
);

export const Note = mongoose.model("Note", noteSchema);
