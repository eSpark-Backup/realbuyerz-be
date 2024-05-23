/* eslint-disable prettier/prettier */
import { TryCatch } from '../middlewares/error.js';
import Chat from '../models/chat.js';
import Message from '../models/message.js';
import User from '../models/user.js';
import { ErrorHandler } from '../utils/utility.js';
import { cookieOptions } from '../utils/features.js';

import jwt from 'jsonwebtoken';
import { max } from 'class-validator';

const adminLogin = TryCatch(async (req, res, next) => {
  const { secretKey } = req.body;
  const adminSecretKey = process.env.ADMIN_SECRET_KEY || 'admin1234';
  const isMatch = secretKey === adminSecretKey;
  if (!isMatch) return next(new ErrorHandler('Invalid Secret Key', 401));
  const token = jwt.sign({ secretKey }, process.env.JWT_SECRET);
  return res
    .status(200)
    .cookie('badami-admin', token, {
      ...cookieOptions,
      maxAge: 24 * 3600 * 1000,
    })
    .json({ success: true, message: 'Admin Logged In' });
});

const adminLogout = TryCatch(async (req,res) => {
  return res
    .status(200)
    .cookie('badami-admin', '', {
      ...cookieOptions,
      maxAge: 0,
    })
    .json({ success: true, message: 'Admin Logged Out' });
});

const getAdminData = TryCatch(async (req, res,next) => {
  const adminId= req.id;
  
  return res.status(200).json({ success: true, message: 'Admin Data'})
});


const allUsers = TryCatch(async (req, res) => {
  const users = await User.find({});

  const Users = await Promise.all(
    users.map(async ({ name, username, avatar, _id }) => {
      const [connections] = await Promise.all([
        Chat.countDocuments({ members: _id }),
      ]);
      return {
        name,
        username,
        avatar,
        _id,
        connections,
      };
    }),
  );

  return res.status(200).json({ Users });
});

const allMessages = TryCatch(async (req, res) => {
  const messages = await Message.find({})
    .populate('sender', 'name avatar')
    .populate('chat');

  const transformedMessages = messages
    .map(({ _id, sender, chat, content, attachments, createdAt }) => {
      return {
        _id,
        sender: {
          _id: sender._id,
          name: sender.name,
          avatar: sender.avatar?.url || null, // Safely access avatar.url
        },
        chat: {
          _id: chat._id,
          name: chat.name,
        },

        content,
        attachments,
        createdAt,
      };
    })
    .filter((message) => message !== null); // Filter out any null values due to errors
  const countMessages = transformedMessages.length;
  return res.status(200).json({
    success: true,
    messages: transformedMessages,
    countMessages: countMessages,
  });
});

const getDashboardStats = TryCatch(async (req, res) => {
  const [totalUsers, totalChats, totalMessages] = await Promise.all([
    User.countDocuments(),
    Chat.countDocuments(),
    Message.countDocuments(),
  ]);

  const today = new Date();
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const last7DaysMessages = await Message.find({
    createdAt: {
      $gte: last7Days,
      $lte: new Date(),
    },
  }).select('createdAt');

  const messages = new Array(7).fill(0);
  const dayInMiliseconds = 24 * 60 * 60 * 1000;

  last7DaysMessages.forEach((message) => {
    const indexApprox =
      (today.getTime() - message.createdAt.getTime()) / dayInMiliseconds;
    const index = Math.floor(indexApprox);
    messages[6 - index]++;
  });

  const stats = {
    totalUsers,
    totalChats,
    totalMessages,
    messagesChart: messages,
  };
  return res.status(200).json({ success: true, stats });
});

const allChats = TryCatch(async (req, res) => {
  const chats = await Chat.find({}).populate('members', 'name avatar');

  const transformedChats = await Promise.all(
    chats.map(async ({ members, _id, name }) => {
      const totalMessages = await Message.countDocuments({ chat: _id });
      return {
        _id: _id,
        name: name,
        avatar: members.slice(0, 2).map(({ avatar }) => avatar.url),
        members: members.map((member) => ({
          _id: member._id,
          name: member.name,
          avatar: member.avatar.url,
        })),
        totalMessages: totalMessages,
      };
    }),
  );

  return res.status(200).json({ transformedChats });
});

export {
  allUsers,
  allChats,
  allMessages,
  getDashboardStats,
  adminLogin,
  adminLogout,
  getAdminData
};
