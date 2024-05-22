/* eslint-disable prettier/prettier */
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import Chat from '../models/chat.js';
import { ErrorHandler } from '../utils/utility.js';
import { cookieOptions, emitEvent, sendToken } from '../utils/features.js';
import { TryCatch } from '../middlewares/error.js';
import Request from '../models/request.js';
import { NEW_REQUEST, REFETCH_CHAT } from '../constants/events.js';
import { request } from 'http';
import { getOtherMember } from '../lib/helper.js';
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
const acceptRequest = TryCatch(async (req, res, next) => {
  const { requestId, acceptRequest } = req.body;
  const request = await Request.findById(requestId)
    .populate('sender', 'name')
    .populate('receiver', 'name');
  if (!request) return next(new ErrorHandler('Request not found', 404));

  if (request.receiver._id.toString() !== req.user) {
    return next(
      new ErrorHandler('You are not authorized to accept this request', 401),
    );
  }
  if (!acceptRequest) {
    await request.deleteOne();
    return res.status(200).json({ success: true, message: 'Request Rejected' });
  }
  const members = [request.sender._id, request.receiver._id];
  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name} and ${request.receiver.name}`,
    }),
    request.deleteOne(),
  ]);
  emitEvent(req, REFETCH_CHAT, members);
  res.status(200).json({
    success: true,
    message: 'Request Accepted',
    senderId: request.sender._id,
  });
});

const getMyNotifications = TryCatch(async (req, res) => {
  const requests = await Request.find({ receiver: req.user })
    .populate('sender', 'name avatar')
    .sort('-createdAt');

  const allRequests = requests.map(({ sender, _id }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));
  res.status(200).json({ allRequests });
});

const getMyFriends = TryCatch(async (req, res) => {
  const chatId = req.query.chatId;
  const chat = await Chat.find({ members: req.user }).populate(
    'members',
    'name avatar',
  );

  const friends = chat.map(({members}) => {
    const otherUser = getOtherMember(members, req.user);
    return {
      _id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar.url,
    };
  });
  if (chatId) {
    const chat = await Chat.findById(chatId);
    const availableFriends = friends.filter(
      (friend) => !chat.members.includes(friend._id),
    );
    return res.status(200).json({ success: true, friends: availableFriends });
  } else {
    return res.status(200).json({ success: true, friends });
  }
});

export {
  newUser,
  loginUser,
  getMyProfile,
  logOutUser,
  searchUser,
  sendRequest,
  acceptRequest,
  getMyNotifications,
  getMyFriends
};
