import express from "express";
import { validateJWT } from "../middlewares/validateJWT";
import { validateUserInChat } from "../middlewares/validateUserInChat";
import { getMessages } from "./controllers";

const router = express.Router();

router.use(validateJWT);

router.get("/chat/:id/:offset", validateUserInChat, getMessages);

export default router;