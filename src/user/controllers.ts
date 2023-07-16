import { Response } from "express";
import Users from "../models/user";
import bcrypt from "bcrypt";
import Chats from "../models/chat";

export const updateUser = async(req: any, res: Response) => {

    const { uid } = req.params;
    const data = req.body;

    if(data.password) data.password = await bcrypt.hash(data.password, 10);

    try {

        await Users.findByIdAndUpdate(uid, req.body);

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

export const delUser = async(req: any, res: Response) => {

    const { uid } = req.params;

    try {

        await Chats.updateOne({ members: uid }, {
            $pull: {
                members: uid
            }
        });

        const chats = await Chats.find({ admin: uid });

        for (const chat of chats) {

            const doc = await Chats.findOne({ _id: chat._id }, { members: { $slice: 1 } });
        
            if (doc?.members) {
                
                chat.admin = (doc.toObject() as any).members[0] ;
                await chat.save();
                
            }
        }

        await Users.findByIdAndDelete(uid);

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