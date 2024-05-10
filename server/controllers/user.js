/* eslint-disable prettier/prettier */
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { ErrorHandler } from "../utils/utility.js";
import { cookieOptions, sendToken } from "../utils/features.js";
import { tryCatch } from "../middlewares/error.js";
const newUser = tryCatch(async (req, res, next) => {
  const { name, username, email, password } = req.body;

  const avatar = {
    public_id: "123456",
    url: "https://www.google.com",
  };

  const user = await User.create({ name, username, email, password, avatar });
  sendToken(res, user, 200, "User created successfully");
});

const loginUser = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  sendToken(res, user, 200, "User logged in successfully");
});

const getMyProfile = tryCatch(async (req, res, next) => {
  await User.findById(req.user).then((user) => {
    res.status(200).json({ user });
  });
});

const logOutUser = tryCatch(async (req, res, next) => {
  res.cookie("badami", null, {
    ...cookieOptions,maxAge:0 
  });

  res.status(200).json({ success: true, message: "Logged out" });
});

const searchUser = tryCatch(async (req, res, next) => {
  const {name} = req.query;
  const users = await User.find({name:{$regex:name,$options:"i"}}).select("name avatar");
  res.status(200).json({users});
  
});

export { newUser, loginUser, getMyProfile ,logOutUser,searchUser};
