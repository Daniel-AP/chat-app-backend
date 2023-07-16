import { Response } from "express";
import Users from "../models/user";

export const searchUsersByEmail = async(req: any, res: Response) => {

    const email = req.params.query;

    try {

        const users = await Users.find({ email: { $regex: new RegExp(`^${email}`, "i") }}).where("_id").ne(req.uid).select("_id name email photoURL").limit(25);

        return res.json({

            ok: true,
            users

        });
        
    } catch (error) {

        return res.json({

            ok: false,
            msg: "There has been an error. Please try again later."

        });
        
    }

};