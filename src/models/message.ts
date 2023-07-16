import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({

    chatId: {
        type: mongoose.Types.ObjectId,
        ref: "Chat"
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    content: String

}, {

    timestamps: true,
    strict: true

});

const Message = mongoose.model("Message", messageSchema);

export default Message;