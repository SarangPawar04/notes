import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


export const signup = async (req, res) =>{
    try {
        const {userName, email, password} = req.body;

        //check if all fields are there
        if(!userName || !email || !password){
            return res.status(400).json({success : false, message : "All fields are required"});
        }

        //check if user is already exists
        const existingUser = await User.findOne({email});

        //if already exists send the error
        if(existingUser){
            return res.status(400).json({success : false, message : "User already exists"}); 
        }

        //create the hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //after all the steps, create the user
        const newUser = await User.create ({
            userName,
            email,
            password : hashedPassword
        });

        //after creating the user, send the success message 
        res.status(201).json({
            success : true,
            user: {
                id : newUser._id,
                userName : newUser.userName,
                email : newUser.email
            }
        })

    }
    catch (err){
        res.status(500).json({success: false, message : err.message});
    }
}

export const login = async (req, res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if(!user){
        return res.status(401).json({ success: false, message: "Invalid username" });

    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(401).json({success : false, message : "Invalid Credentials"});
    }

    //generate the jwt token
    const token = jwt.sign(
        {id : user._id, email : user.email},
        process.env.JWT_SECRET,
        {expiresIn : "1d"}
    );

    res.status(200).json({success : true, message : "Login Successful",token,  user:{
        id : user._id,
        userName : user.userName,
        email : user.email
    }});
}
