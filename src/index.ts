import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./database/config";
import authRouter from "./auth/routes";
import chatsRouter from "./chat/routes";
import messagesRouter from "./messages/routes";
import userRouter from "./user/routes";
import searchRouter from "./search/routes";
import cloudinaryRouter from "./cloudinary/routes";
import { socketConnection } from "./socket/config";
import { cloudinaryConnection } from "./cloudinary/config";

const app = express();

dotenv.config();
dbConnection();
socketConnection();
cloudinaryConnection();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/chats", chatsRouter);
app.use("/messages", messagesRouter);
app.use("/users", userRouter);
app.use("/search", searchRouter);
app.use("/cloudinary", cloudinaryRouter);

app.listen(process.env.PORT, () => {

    console.log("Listening");

});