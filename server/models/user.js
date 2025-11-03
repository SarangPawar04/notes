//user data modeling

import mongoose, {Schema} from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName : {
            type : String,
            required : true, 
            unique : true
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true
        },
        password : {
            type : String,
            required : true
        },
        passwordResetToken: {
            type: String,
            default: null,
        },
        passwordResetExpires: {
            type: Date,
            default: null,
        },
    },{timestamps : true}
)

export const User = mongoose.model("User", userSchema);
export default User;