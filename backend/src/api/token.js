import express from "express";
import auth from "../utils/auth.js";
import getToken from "./token-get.js";

const router = express.Router();

router.get("/", auth, getToken);

export default router;
