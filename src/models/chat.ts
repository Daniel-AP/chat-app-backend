import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({

    name: String,
    admin: mongoose.Types.ObjectId,
    lastMessage: {
        type: mongoose.Types.ObjectId,
        ref: "Message"  
    },
    members: {

        type: Array<mongoose.Types.ObjectId>,
        ref: "User"

    }

}, {

    timestamps: true,
    strict: true

});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;