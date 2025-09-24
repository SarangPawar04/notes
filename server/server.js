import express from 'express';
import mongoose  from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

const Mongo_url = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;

connectDB();


async function connectDB(){
    try{
        await mongoose.connect(Mongo_url);
        console.log("connected to MongoDB");
    }
    catch(error){
        console.log("Error connecting to MongoDB", error);
    }
}