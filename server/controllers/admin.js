/* eslint-disable prettier/prettier */
import { TryCatch } from '../middlewares/error.js';
import Chat from '../models/chat.js';
import Message from '../models/message.js';
import User from '../models/user.js';

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
    User.countDocuments({where: {role: 'user'}}),
    Chat.countDocuments(),
    Message.countDocuments(),
  ]);
  return res
    .status(200)
    .json({ success: true, totalUsers, totalChats, totalMessages });
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

export { allUsers, allChats, allMessages,getDashboardStats };
