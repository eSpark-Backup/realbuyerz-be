/* eslint-disable prettier/prettier */
import express from "express";

import {newUser,loginUser, getMyProfile,logOutUser} from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { loginValidator, registerValidator,validateHandler } from "../lib/validators.js";


const router = express.Router();

router.post("/new",singleAvatar,registerValidator(),validateHandler, newUser);
router.post("/login",loginValidator(),validateHandler, loginUser);


// after here user must be logged in to access route below
router.use(isAuthenticated);
router.get("/profile",getMyProfile);
router.get("/logout",logOutUser)


export  default router;
