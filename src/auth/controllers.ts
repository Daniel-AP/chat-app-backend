import { Request, Response } from "express";
import Users from "../models/user";
import bcrypt from "bcrypt";
import { generateJWT } from "../helpers/generateJWT";
import jwt from "jsonwebtoken";

export const signUp = async(req: Request, res: Response) => {

    const { name, password, email, photoURL } = req.body;

    try {

        const userExists = await Users.findOne({ email });

        if(userExists) return res.json({

            ok: false,
            msg: "There has been an error. Please try again later."

        });

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = new Users({

            name,
            email,
            password: encryptedPassword,
            photoURL

        });

        const jwt = await generateJWT({ uid: newUser._id, name });

        await newUser.save();

        return res.json({

            ok: true,
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            photoURL: newUser.photoURL,
            createdAt: newUser.createdAt,
            jwt

        });
        
    } catch (error) {

        return res.json({

            ok: false,
            msg: "There has been an error. Please try again later."

        });
        
    }

};

export const logIn = async(req: Request, res: Response) => {

    const { email, password } = req.body;

    try {

        const user = await Users.findOne({ email });

        if(!user) return res.json({

            ok: false,
            msg: "There has been an error. Please try again later."
            
        });

        const isValid = await bcrypt.compare(password, user.password as string);

        if(!isValid) return res.json({
            
            ok: false,
            msg: "There has been an error. Please try again later."

        });

        const jwt = await generateJWT({ uid: user._id, name: user.name as string });

        return res.json({

            ok: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: user.createdAt,
            jwt

        });
        
    } catch (error) {

        return res.json({

            ok: false,
            msg: "There has been an error. Please try again later."

        });
        
    }

};

export const logged = async(req: Request, res: Response) => {

    const token = req.headers["x-token"] as string;

    try {

        const payload: any = await jwt.verify(token, process.env.SECRET_JWT_SEED as string);
        const user = await Users.findById(payload?.uid);

        return res.json({

            ok: true,
            _id: user?._id,
            name: user?.name,
            email: user?.email,
            photoURL: user?.photoURL,
            createdAt: user?.createdAt

        });
        
    } catch (error) {

        return res.json({

            ok: false,
            msg: "Not logged"

        });
        
    }

};

export const renew = async(req: any, res: Response) => {

    try {

        const jwt = await generateJWT({ uid: req.uid, name: req.name });

        return res.json({

            ok: true,
            jwt

        });
        
    } catch (error) {

        return res.json({

            ok: false,
            msg: "There has been an error. Please try again later."

        });
        
    }

};