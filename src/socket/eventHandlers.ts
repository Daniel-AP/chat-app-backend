import { Socket } from "socket.io";
import { emitEventToChat } from "../helpers/emitEventToChat";
import Message from "../models/message";
import { verifyIdentity } from "../helpers/verifyIdentity";
import Chats from "../models/chat";

export const handleUserTyping = (connectedUsers: Map<string, Socket>, data: { uid: string, chatId: string, name: string, jwt: string }) => {

    if(!verifyIdentity(data.jwt, data.chatId)) return;

    emitEventToChat(data.uid, connectedUsers, "userTyping", data.chatId, { chatId: data.chatId, user: { uid: data.uid, name: data.name } });

};

export const handleUserNotTyping = (connectedUsers: Map<string, Socket>, data: { uid: string, chatId: string, jwt: string }) => {

    if(!verifyIdentity(data.jwt, data.chatId)) return;

    emitEventToChat(data.uid, connectedUsers, "userNotTyping", data.chatId, data.chatId);

};

export const handleNewMessage = async(connectedUsers: Map<string, Socket>, data: { uid: string, chat: {id: string, name: string}, message: { clientId: number, content: string }, jwt: string }) => {

    if(!verifyIdentity(data.jwt, data.chat.id)) return;

    const socket = connectedUsers.get(data.uid) as Socket;

    try {

        const messageDoc = new Message({

            chatId: data.chat.id,
            userId: data.uid,
            content: data.message.content

        });

        await messageDoc.save();

        await Chats.findByIdAndUpdate(data.chat.id, {
            lastMessage: messageDoc._id
        });

        const savedMessage = await Message.findById(messageDoc._id).populate("userId", "_id name photoURL");

        socket.emit("newMessageResponse", {

            ok: true,
            _id: messageDoc._id,
            clientId: data.message.clientId,
            chatId: data.chat.id,
            userId: savedMessage?.userId,
            content: data.message.content,
            createdAt: savedMessage?.createdAt

        });

        emitEventToChat(data.uid, connectedUsers, "incomingMessage", data.chat.id, {

            _id: messageDoc._id,
            clientId: data.message.clientId,
            chat: data.chat,
            userId: savedMessage?.userId,
            content: data.message.content,
            createdAt: savedMessage?.createdAt

        });
        
    } catch (error) {

        socket.emit("newMessageResponse", {
            
            ok: false,
            clientId: data.message.clientId,
            chatId: data.chat.id

        });
        
    }

};

export const handleDelMessage = async(conntectedUsers: Map<string, Socket>, data: { uid: string, chatId: string, messageId: string, jwt: string }) => {

    if(!verifyIdentity(data.jwt, data.chatId)) return;

    const socket = conntectedUsers.get(data.uid) as Socket;

    try {

        await Message.findByIdAndDelete(data.messageId);

        const nextLastMessage = await Message.findOne({ chatId: data.chatId }).sort({ createdAt: -1 }).populate("userId", "_id name photoURL");

        await Chats.findByIdAndUpdate(data.chatId, { 
            lastMessage: nextLastMessage?._id
        });

        socket.emit("delMessageResponse", {

            ok: true,
            id: data.messageId,
            chatId: data.chatId,
            lastMessage: nextLastMessage

        });

        emitEventToChat(data.uid, conntectedUsers, "messageDeleted", data.chatId, {

            chatId: data.chatId,
            id: data.messageId,
            lastMessage: nextLastMessage

        });
        
    } catch (error) {
        
        socket.emit("delMessageResponse", {

            ok: false,
            id: data.messageId,
            chatId: data.chatId

        });

    }

};

export const handleDisconnect = (connectedUsers: Map<string, Socket>, uid: string) => {

    connectedUsers.delete(uid);

};