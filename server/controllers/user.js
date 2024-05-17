/* eslint-disable prettier/prettier */
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { ErrorHandler } from '../utils/utility.js';
import { cookieOptions, emitEvent, sendToken } from '../utils/features.js';
import { TryCatch } from '../middlewares/error.js';
import Request from '../models/request.js';
import { NEW_REQUEST } from '../constants/events.js';
const newUser = TryCatch(async (req, res, next) => {
  const { name, username, email, password } = req.body;

  const avatar = {
    public_id: '123456',
    url: 'https://www.google.com',
  };

  const user = await User.create({ name, username, email, password, avatar });
  sendToken(res, user, 200, 'User created successfully');
});

const loginUser = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please enter email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid credentials', 401));
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) {
    return next(new ErrorHandler('Invalid credentials', 401));
  }

  sendToken(res, user, 200, 'User logged in successfully');
});

const getMyProfile = TryCatch(async (req, res) => {
  await User.findById(req.user).then((user) => {
    res.status(200).json({ user });
  });
});

const logOutUser = TryCatch(async (req, res) => {
  res.cookie('badami', null, {
    ...cookieOptions,
    maxAge: 0,
  });

  res.status(200).json({ success: true, message: 'Logged out' });
});

const searchUser = TryCatch(async (req, res) => {
  const { name } = req.query;
  const users = await User.find({
    name: { $regex: name, $options: 'i' },
  }).select('name avatar');
  res.status(200).json({ users });
});

const sendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;
  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });
  if (request) return next(new ErrorHandler('Request already sent', 400));
  await Request.create({ sender: req.user, receiver: userId });
  emitEvent(req, NEW_REQUEST, [userId]);

  res
    .status(200)
    .json({ success: true, message: 'Connect Request sent to Agent' });
});

export {
  newUser,
  loginUser,
  getMyProfile,
  logOutUser,
  searchUser,
  sendRequest,
};
