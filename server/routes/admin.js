/* eslint-disable prettier/prettier */
import express, { Router } from 'express';

import { isAuthenticated } from '../middlewares/auth.js';
import { allChats, allMessages, allUsers, getDashboardStats } from '../controllers/admin.js';

const router = express.Router();
router.get("/")
router.post("/verify")
router.get("/logout")
router.get("/users",allUsers)
router.get("/chats",allChats)
router.get("/messages",allMessages)
router.get("/stats",getDashboardStats)
router.use(isAuthenticated);



export default router;
