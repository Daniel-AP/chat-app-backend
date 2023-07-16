import { NextFunction, Response } from "express";
import { validateUserAdmin } from "./validateUserAdmin";

export const validateDelMember = async(req: any, res: Response, next: NextFunction) => {

    const { uid } = req.params;

    if(uid !== req.uid) {

        validateUserAdmin(req, res, next);

        return;

    }

    next();

};