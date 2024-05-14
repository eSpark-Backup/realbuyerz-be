/* eslint-disable prettier/prettier */
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const cookieOptions = {
  maxAge: 24 * 3600 * 1000,
  sameSite: "none",
  secure: true,
  httpOnly: true,
};
const connectDb = (uri) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(uri).then((res, err) => {
      if (err) return reject(err);
      console.log("Connected to the database");
      resolve();
    });
  });
};
const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return res
    .status(code)
    .cookie("badami", token, cookieOptions)
    .json({ success: true, message });
};

const emitEvent = (req, event, users, data) => {
  console.log("Emitting event");
};

const deleteFilesFromCloudinary = async (public_ids) => {
  // delete files from cloudinary
};
export { connectDb, sendToken, cookieOptions, emitEvent ,deleteFilesFromCloudinary};
