import { Server, Socket } from "socket.io";
import { handleDelMessage, handleDisconnect, handleNewMessage, handleUserNotTyping, handleUserTyping } from "./eventHandlers";

export const socketConnection = () => {

    const io = new Server(4000, {
        cors: {
            origin: process.env.ORIGIN
        }
    });
    
    const connectedUsers = new Map();
    
    io.on("connection", (socket: Socket) => {

        const uid = socket.handshake.query.uid as string;

        connectedUsers.set(uid, socket);

        socket.on("userTyping", (data: any) => handleUserTyping(connectedUsers, data));
        socket.on("userNotTyping", (data: any) => handleUserNotTyping(connectedUsers, data));
        socket.on("newMessage", (data: any) => handleNewMessage(connectedUsers, data));
        socket.on("delMessage", (data: any) => handleDelMessage(connectedUsers, data));
        socket.on("disconnect", () => handleDisconnect(connectedUsers, uid));

    });

};