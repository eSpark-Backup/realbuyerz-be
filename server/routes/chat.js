/* eslint-disable prettier/prettier */
import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import { newGroupChat,getMyChats ,leaveChat} from "../controllers/chat.js";
const router = express.Router();
router.use(isAuthenticated);
router.post("/new", newGroupChat);
router.get("/my",getMyChats)
router.delete("/leave/:id",leaveChat)
export default router;
