import express from "express";
import { validateJWT } from "../middlewares/validateJWT";
import { signature } from "./controllers";

const router = express.Router();

router.get("/signature", signature);

export default router;