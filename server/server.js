import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose  from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import savedNoteRoutes from './routes/savedNoteRoutes.js';


const app = express();

//cors
app.use(cors());

// parse JSON bodies
app.use(express.json());

// serve local uploads (for files saved in \"uploads/\")
app.use('/uploads', express.static('uploads'));

app.use('/api/notes', noteRoutes);
// routes are used here 
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/saved', savedNoteRoutes);

const Mongo_url = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;




async function connectDB(){
    try{
        await mongoose.connect(Mongo_url);
        console.log("connected to MongoDB");
        // Start server after DB connection
        app.listen(PORT, ()=>{
            console.log(`server is running on port ${PORT}`);
        });
    }
    catch(error){
        console.log("Error connecting to MongoDB", error);
    }
}
connectDB();