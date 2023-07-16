import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({

    name: String,
    password: String,
    email: {
        type: String,
        unique: true,
        immutable: true
    },
    photoURL: String,

}, {
    
    timestamps: true,
    strict: true
    
});

const User = mongoose.model("User", userSchema);

export default User;