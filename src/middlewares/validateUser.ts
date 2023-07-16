import { NextFunction, Response } from "express";

export const validateUser = (req: any, res: Response, next: NextFunction) => {

    const { uid } = req.params;

    if(uid !== req.uid) return res.json({

        ok: false,
        msg: "Invalid request"

    });

    next();

};