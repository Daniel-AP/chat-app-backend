import { Response } from "express";
import Messages from "../models/message";

export const getMessages = async(req: any, res: Response) => {

    const { id: chatId, offset } = req.params;

    try {

        const messageCount = await Messages.countDocuments({ chatId });
        const messages = await Messages.find({ chatId }).sort({ createdAt: 1 }).skip(messageCount-(offset+50) > 0 ? messageCount-(offset+50) : 0).limit(messageCount-offset).populate("userId", "_id name photoURL");

        return res.json({

            ok: true,
            messages

        });
        
    } catch (error) {

        return res.json({

            ok: false,
            msg: "There has been an error. Please try again later."

        });
        
    }
    
};