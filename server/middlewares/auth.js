/* eslint-disable prettier/prettier */
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";

const isAuthenticated =  (req, res, next) => {
  const token = req.cookies["badami"];
  if (!token) {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded.id;

  next();
};

const isAdmin =  (req, res, next) => {
  const token = req.cookies["badami-admin"];
  if (!token) return next(new ErrorHandler("Only admin can access this resource", 401));

  const secretKey = jwt.verify(token, process.env.JWT_SECRET);
  const adminSecretKey = process.env.ADMIN_SECRET_KEY || "admin1234";
  if (secretKey.secretKey !== adminSecretKey) {
    return next(new ErrorHandler("Not authorized as an admin", 401));
  }

  req.user = secretKey.id;

  next();
};


export { isAuthenticated,isAdmin };
