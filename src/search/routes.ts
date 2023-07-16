import express from "express";
import { searchUsersByEmail } from "./controllers";
import { validateJWT } from "../middlewares/validateJWT";

const router = express.Router();

router.use(validateJWT);

router.get("/:query", searchUsersByEmail);

export default router;