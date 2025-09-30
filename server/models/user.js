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
            type : string,
            required : true
        },
    },{timestamps : true}
)

export const User = mongoose.model("User", userSchema);
export default User;

function string(string) {
    throw new Error('Function not implemented.');
}