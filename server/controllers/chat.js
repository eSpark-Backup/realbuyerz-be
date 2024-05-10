/* eslint-disable prettier/prettier */
import { ALERT, REFETCH_CHAT } from '../constants/events.js';
import { getOtherMember } from '../lib/helper.js';
import { tryCatch } from '../middlewares/error.js';
import Chat from '../models/chat.js';
import User from '../models/user.js';
import { emitEvent } from '../utils/features.js';
import { ErrorHandler } from '../utils/utility.js';
const newGroupChat = tryCatch(async (req, res) => {
  const { name, members } = req.body;

  const allMembers = [...members, req.user];
  await Chat.create({ name, members: allMembers });
  emitEvent(req, ALERT, allMembers, `Welcome to ${name}`);
  emitEvent(req, REFETCH_CHAT, members);

  return res.status(201).json({ message: 'Group chat created' });
});

const getMyChats = tryCatch(async (req, res) => {
  const chats = await Chat.find({ members: req.user }).populate(
    'members',
    'name avatar',
  );

  const Chats = chats.map((chat) => {
    const members = getOtherMember(chat.members, req.user);

    return { ...chat._doc, members };
  });

  return res.status(200).json({ Chats, message: 'Get All chat' });
});

const leaveChat = tryCatch(async (req, res, next) => {
  const  chatId  = req.params.id;
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler('Chat not found', 404));
  }
  await Promise.all([
    Chat.findByIdAndUpdate(chatId, { $pull: { members: req.user } }),
  ]);
  const findUser = await User.findById(req.user);

  emitEvent(req, ALERT, chat.members, `${findUser.name} left the chat`);
  emitEvent(req, REFETCH_CHAT, chat.members);

  return res.status(200).json({ message: `${findUser.name} left the Chat` });
});

export { newGroupChat, getMyChats, leaveChat };
