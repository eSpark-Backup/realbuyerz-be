/* eslint-disable prettier/prettier */
import express, { Router } from 'express';

import { isAdmin } from '../middlewares/auth.js';
import { adminLogin, adminLogout, allChats, allMessages, allUsers, getAdminData, getDashboardStats } from '../controllers/admin.js';
import { adminLoginValidator, validateHandler } from '../lib/validators.js';

const router = express.Router();
router.post("/verify",adminLoginValidator(),validateHandler, adminLogin)
router.get("/logout",adminLogout)



//Only admin can access these routes 
router.use(isAdmin);
router.get("/",getAdminData)
router.get("/users",allUsers)
router.get("/chats",allChats)
router.get("/messages",allMessages)
router.get("/stats",getDashboardStats)



export default router;
