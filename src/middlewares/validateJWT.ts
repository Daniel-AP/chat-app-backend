import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IJWTPayload } from "../types/interfaces/auth/JWTPayload";

export const validateJWT = async(req: any, res: Response, next: NextFunction) => {

    const token = req.headers["x-token"] as string;

    try {

        const user = await jwt.verify(token, process.env.SECRET_JWT_SEED as string) as IJWTPayload;

        req.uid = user.uid;
        req.name = user.name;

        next();
        
    } catch (error) {

        return res.json({

            ok: false,
            msg: "Invalid token"

        });
        
    }

};