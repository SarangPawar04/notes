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
            default : "",
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
        comments : [
            {
                user : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
                text : {type : String , required : true},
                createdAt : {type : Date, default : Date.now},
            },
        ],
    },{timestamps : true}
);

export const Note = mongoose.model("Note", noteSchema);
export default Note;
 