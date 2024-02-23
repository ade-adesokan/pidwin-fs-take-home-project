import express from "express";
import auth from "../utils/auth.js";
import tossCoin from "./toss-coin.js";

const router = express.Router();

router.post("/", auth, tossCoin);

export default router;
