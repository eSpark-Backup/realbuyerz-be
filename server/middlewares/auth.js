/* eslint-disable prettier/prettier */
import { BADAMI_TOKEN } from '../constants/config.js';
import User from '../models/user.js';
import { ErrorHandler } from '../utils/utility.js';
import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
  const token = req.cookies[BADAMI_TOKEN];
  if (!token) {
    return next(new ErrorHandler('Login first to access this resource', 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded.id;

  next();
};

const isAdmin = (req, res, next) => {
  const token = req.cookies['badami-admin'];
  if (!token)
    return next(new ErrorHandler('Only admin can access this resource', 401));

  const secretKey = jwt.verify(token, process.env.JWT_SECRET);
  const adminSecretKey = process.env.ADMIN_SECRET_KEY || 'admin1234';
  if (secretKey.secretKey !== adminSecretKey) {
    return next(new ErrorHandler('Not authorized as an admin', 401));
  }

  req.user = secretKey.id;

  next();
};

const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);
    const authToken = socket.request.headers.authorization?.split(' ')[1];

    if (!authToken)
      return next(
        new ErrorHandler('Please login to access this resource', 401),
      );
    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);
    const user = await User.findById(decodedData.chatId);
    if (!user) return next(new ErrorHandler('User not found', 404));
    socket.user = user;
    next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler('Please login to access this resource', 401));
  }
};

export { isAuthenticated, isAdmin, socketAuthenticator };
