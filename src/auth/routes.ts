import express from "express";
import { check } from "express-validator";
import { validateErrors } from "../middlewares/validateErrors";
import { logIn, logged, renew, signUp } from "./controllers";
import { validateJWT } from "../middlewares/validateJWT";

const router = express.Router();

router.post("/signup", [
    check("name").notEmpty(),
    check("name").isLength({
        min: 6,
        max: 15
    }),
    check("email").notEmpty(),
    check("email").isEmail(),
    check("password").notEmpty(),
    check("password").isLength({
        min: 6,
        max: 15
    }),
    validateErrors
], signUp);

router.post("/login", [
    check("email").notEmpty(),
    check("email").isEmail(),
    check("password").notEmpty(),
    check("password").isLength({
        min: 6,
        max: 15
    }),
    validateErrors
], logIn);

router.get("/logged", logged);

router.get("/renew", validateJWT, renew);

export default router;