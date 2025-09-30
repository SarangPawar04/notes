import express from 'express';
import mongoose  from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';


dotenv.config();
const app = express();

// parse JSON bodies
app.use(express.json());


// routes are used here 
app.use('/api/auth', authRoutes);

const Mongo_url = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;




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