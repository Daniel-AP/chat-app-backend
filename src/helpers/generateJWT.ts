import jwt from "jsonwebtoken";
import { IJWTPayload } from "../types/interfaces/auth/JWTPayload";

export const generateJWT = async(payload: IJWTPayload) => {

    try {

        const token = await jwt.sign(payload, process.env.SECRET_JWT_SEED as string, { expiresIn: "3h" });

        return token;
        
    } catch (error) {

        return null;
        
    }

};