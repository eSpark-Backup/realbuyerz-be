import express from "express";

import {newUser,loginUser, getMyProfile,logOutUser} from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new",upload, newUser);
router.post("/login", loginUser);


// after here user must be logged in to access route below
router.use(isAuthenticated);
router.get("/profile",getMyProfile);
router.get("/logout",logOutUser)


export  default router;
