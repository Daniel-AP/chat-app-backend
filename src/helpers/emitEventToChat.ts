import { Socket } from "socket.io";
import Chats from "../models/chat";

export const emitEventToChat = async(uid: string ,connectedUsers: Map<string, Socket>, name: string, chatId: string, data: any) => {

    const result = await Chats.findById(chatId).select("-_id members");
    const members = result?.toObject().members;
    
    if(Array.isArray(members)) {

        members.forEach((id: string) => {

            if(!connectedUsers.get(id)) return;
            if(id === uid) return;

            const memberSocket = connectedUsers.get(id) as Socket;

            memberSocket.emit(name, data);

        });

    }

};