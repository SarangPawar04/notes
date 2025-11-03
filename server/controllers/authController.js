import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import crypto from "crypto";


export const signup = async (req, res) =>{
    try {
        const {userName: rawUserName, name, email, password} = req.body;
        const userName = rawUserName || name; // accept either userName or name

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

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const user = await User.findOne({ email });
        // Always respond 200 to avoid email enumeration
        if (!user) {
            return res.status(200).json({ success: true, message: "If that email is registered, a reset link was sent" });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");
        user.passwordResetToken = hashed;
        user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/reset?token=${rawToken}`;
        return res.status(200).json({ success: true, message: "Reset link generated", resetUrl });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: "Token and newPassword are required" });
        }
        const hashed = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            passwordResetToken: hashed,
            passwordResetExpires: { $gt: new Date() },
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        return res.status(200).json({ success: true, message: "Password has been reset" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
