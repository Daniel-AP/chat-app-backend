import jwt from "jsonwebtoken";
import { IJWTPayload } from "../types/interfaces/auth/JWTPayload";
import Chats from "../models/chat";

export const verifyIdentity = async(token: string, chatId: string) => {

    try {

        const user = await jwt.verify(token, process.env.SECRET_JWT_SEED as string) as IJWTPayload;

        const chat = await Chats.find({ _id: chatId, members: user.uid });

        if(!chat) return false;

        return true;
        
    } catch (error) {

        return false;
        
    }

};