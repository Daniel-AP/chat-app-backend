import express from "express";
import { validateJWT } from "../middlewares/validateJWT";
import { delUser, updateUser } from "./controllers";

const router = express.Router();

router.use(validateJWT);

router.put("/:uid", updateUser);

router.delete("/:uid", delUser);

export default router;