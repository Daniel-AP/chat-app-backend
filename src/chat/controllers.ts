import { Response } from "express";
import Chats from "../models/chat";
import Messages from "../models/message";
import Users from "../models/user";

export const createChat = async(req: any, res: Response) => {

    const { name, members } = req.body;

    try {

        const newChat = new Chats({

            name,
            members,
            admin: req.uid

        });

        await newChat.save();

        const doc = await Chats.findById(newChat._id).populate("members", "photoURL");

        return res.json({

            ok: true,
            _id: newChat._id,
            members: doc?.members,
            name,

        });
        
    } catch (error) {

        return res.json({

            ok: false,
            msg: "There has been an error. Please try again later."

        });
        
    }

};

export const getChat = async(req: any, res: Response) => {

    const { id } = req.params;

    try {

        const messageCount = await Messages.countDocuments({ chatId: id});
        const chat = (await Chats.findById(id).populate("members", "_id name email photoURL"))?.toObject();
        const messages = await Messages.find({ chatId: id }).sort({ createdAt: 1 }).skip(messageCount-50 > 0 ? messageCount-50 : 0).limit(50).populate("userId", "_id name photoURL");

        return res.json({

            ok: true,
            chat: {
                ...chat,
                messageCount
            },
            messages

        });
        
    } catch (error) {

        return res.json({

            ok: false,
            msg: "There has been an error. Please try again later."

        });
        
    }

};

export const getChatsByUser = async(req: any, res: Response) => {

    const { uid } = req.params;

    try {

        const chats = await Chats.find({ members: uid }).populate("members", "photoURL").populate("lastMessage", "_id content createdAt userId").select("_id name members lastMessage");
        
        const chatsWithUser = await Promise.all(chats.map(async(value: any) => {

            if (value.lastMessage) {

                const userInfo = await Users.findById(value.lastMessage.userId).select("_id name photoURL");
                return {
                    ...value.toObject(),
                    lastMessage: {
                        ...value.lastMessage.toObject(),
                        userId: {
                            ...userInfo?.toObject()
                        }
                    }
                };

            }

            return value;

        }));

        return res.json({

            ok: true,
            chats: chatsWithUser

        });
        
    } catch (error) {

        return res.json({

            ok: false,
            msg: "There has been an error. Please try again later."

        });
        
    }

};

export const updateChat = async(req: any, res: Response) => {

    const { id } = req.params;

    try {

        await Chats.findByIdAndUpdate(id, req.body);

        return res.json({

            ok: true,

        });
        
    } catch (error) {

        return res.json({

            ok: false,
            msg: "There has been an error. Please try again later."

        });
        
    }

};

export const delMember = async(req: any, res: Response) => {

    const { uid, id: chatId } = req.params;

    try {

        const chat = await Chats.findById(chatId);

        await Chats.findByIdAndUpdate(chatId, { $pull: { members: uid } });

        if(chat?.admin?.toString() === uid && chat) {

            const doc = await Chats.findOne({ _id: chatId }, { members: { $slice: 1 } });

            chat.admin = (doc?.toObject() as any).members[0];

            await chat.save();

        }

        return res.json({

            ok: true

        });
        
    } catch (error) {

        return res.json({

            ok: false,
            msg: "There has been an error. Please try again later."

        });
        
    }

};

export const delChat = async(req: any, res: Response) => {

    const { id } = req.params;

    try {

        await Messages.deleteMany({ chatId: id });
        await Chats.findByIdAndDelete(id);

        return res.json({

            ok: true

        });
        
    } catch (error) {

        return res.json({

            ok: false,
            msg: "There has been an error. Please try again later."

        });
        
    }

};