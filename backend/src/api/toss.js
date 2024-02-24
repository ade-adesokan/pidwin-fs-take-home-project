import express from "express";
import auth from "../utils/auth.js";
import tossCoin from "./toss-coin.js";
import getTosses from "./toss-get.js";

const router = express.Router();

router.post("/", auth, tossCoin);
router.get("/", auth, getTosses);

export default router;
