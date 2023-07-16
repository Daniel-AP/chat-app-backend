import { NextFunction, Response } from "express";
import Chats from "../models/chat";

export const validateUserInChat = async(req: any, res: Response, next: NextFunction) => {

    const { id: chatId } = req.params;

    try {

        const chat = await Chats.find({ _id: chatId, members: req.uid });

        if(!chat) return res.json({

            ok: false,
            msg: "Invalid request"

        });

        next();
        
    } catch (error) {

        return res.json({

            ok: false,
            msg: "There has been an error. Please try again later."

        });
        
    }

};