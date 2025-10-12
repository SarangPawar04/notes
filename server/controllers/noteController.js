import Note from "../models/note.js";

//create a note 
export const createNote = async (req, res) =>{
    try {
        
        const {title, description, fileUrl, category} = req.body;

        //check if all fields are there
        if(!title || !fileUrl || !category){
            return res.status(400).json({success : false, message : "All required fields must be filled"});
        }

        const uploaderID = req.user.id;

        //create a new note
        const note = await Note.create({
            title, 
            description,
            fileUrl,
            category,
            uploaderID : req.user.id
        });

        res.status(201).json({success : true, message : "Note uploaded successfully", note});
    }

    catch (error) {
        res.status(500).json({success : false, message : error.message});
    }
};


//get all notes 
export const getAllNotes = async (req, res) =>{
    try{
        const notes = await Note.find().populate("uploaderID", "userName email").sort({createdAt : -1});
        res.status(200).json({success : true, count: notes.length, notes});
    }

    catch(error){
        res.status(500).json({success : false, message : error.message});
    }
};


//get not by id 
export const getNoteById = async (req, res) =>{
    try{
        const note = await Note.findById(req.params.id).populate("uploaderID", "userName email");

        if(!note){
            return res.status(404).json({success : false, message : "Note not found"});
        }

        res.status(200).json({success : true, note});
    }

    catch(error){
        res.status(500).json({success : false, message : error.message});
    }
};



//add comment 
export const addComment = async (req, res) =>{
    try {
        const {text} = req.body;
        const note = await Note.findById(req.params.id);

        if(!note){
            return res.status(404).json({success : false, message : "Note not found"});
        }

        const comment = {
            user : req.user.id,
            text,
        };

        note.comments.push(comment);
        await note.save();

        res.status(200).json({success : true, message : "Comment added successfully", comment/*note or comment check*/ });
    }
    catch (error){
        res.status(500).json({success : false, message : error.message});
    }
;
}



//rate a note

export const rateNote = async (req, res) =>{
    try {
        const {rating} = req.body;
        const note = await Note.findById(req.params.id);

        if(!note){
            return res.status(404).json({success : false, message : "Note not found"});
        }

        if(rating < 0 || rating > 5){
            return res.status(400).json({success : false, message : "Rating must be between 0 and 5"});
        }

        note.ratings = rating;
        await note.save();

        res.status(200).json({success : true, message : "Note rated successfully", note});
    }

    catch (error){
        res.status(500).json({success : false, message : error.message});  
    }
};

//delete a note 

export const deleteNote = async (req, res) =>{
    try {
        const note = await Note.findById(req.params.id);

        if(!note){
            return res.status(404).json({success : false, message : "Note not found"});
        }

        //check if the user is the owner of the note
        if(note.uploaderID.toString() !== req.user.id){
            return res.status(403).json({success : false, message : "You are not authorized to delete this note"});
        }

        await Note.deleteOne({ _id: req.params.id });

        res.status(200).json({success : true, message : "Note deleted successfully"});
    }
    catch(error){
        res.status(500).json({success : false, message : error.message});
    }
};