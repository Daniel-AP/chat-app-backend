/* eslint-disable camelcase */
import cloudinary from "cloudinary";
import { Response } from "express";

export const signature = (req: any, res: Response) => {

    try {

        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.v2.utils.api_sign_request(
            { timestamp },
            process.env.CLOUDINARY_SECRET as string);

        return res.json({

            ok: true,
            timestamp,
            signature
            
        });

    } catch (error) {

        return res.json({
            ok: false,
            msg: "There has been an error. Please try again later."
        });
        
    }

};