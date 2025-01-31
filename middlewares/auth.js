/* eslint-disable prettier/prettier */
import { BADAMI_TOKEN } from '../constants/config.js';
import User from '../models/user.js';
import { ErrorHandler } from '../utils/utility.js';
import jwt from 'jsonwebtoken';
import { TryCatch } from './error.js';

const isAuthenticated = TryCatch((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('Token not found');

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedData.chatId;
  return next();
});

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
    console.log("Socket: ", socket.request.headers);
    console.log("Token: ", authToken);
    console.log(authToken);

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
