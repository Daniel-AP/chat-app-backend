import express from "express";
import { validateJWT } from "../middlewares/validateJWT";
import { check } from "express-validator";
import { createChat, delChat, delMember, getChat, getChatsByUser, updateChat } from "./controllers";
import { validateUser } from "../middlewares/validateUser";
import { validateUserInChat } from "../middlewares/validateUserInChat";
import { validateUserAdmin } from "../middlewares/validateUserAdmin";
import { validateDelMember } from "../middlewares/validateDelMember";
import { validateErrors } from "../middlewares/validateErrors";

const router = express.Router();

router.use(validateJWT);

router.post("/new", [
    check("name").notEmpty(),
    check("name").isLength({
        min: 5,
        max: 30
    }),
    check("members").notEmpty(),
    check("members").isArray({ min: 1, max: 50 }),
    validateErrors
], createChat);

router.get("/user/:uid", validateUser, getChatsByUser);

router.get("/:id", validateUserInChat, getChat);

router.put("/update/:id", validateUserAdmin, updateChat);

router.delete("/del/:id", validateUserAdmin, delChat);

router.delete("/del/:id/user/:uid", validateDelMember, delMember);

export default router;