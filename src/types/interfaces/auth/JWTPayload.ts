import mongoose from "mongoose";

export interface IJWTPayload {

    uid: mongoose.Types.ObjectId,
    name: string

}