import express from 'express';
import mongoose  from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';


dotenv.config();
const app = express();

//cors
app.use(cors());

// parse JSON bodies
app.use(express.json());

app.use('/api/notes', noteRoutes);
// routes are used here 
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

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