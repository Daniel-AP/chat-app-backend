/* eslint-disable camelcase */
import cloudinary from "cloudinary";
import { NextFunction, Response } from "express";

export const validateSignature = (req: any, res: Response, next: NextFunction) => {

    const { public_id, version, signature } = req.body;

    const expectedSignature = cloudinary.v2.utils.api_sign_request({
        public_id,
        version
    }, process.env.CLOUDINARY_SECRET as string);

    if(signature !== expectedSignature) return res.json({
        ok: false
    });

    next();

};