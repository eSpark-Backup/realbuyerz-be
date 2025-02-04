/* eslint-disable prettier/prettier */
import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
  REFETCH_CHAT,
} from '../constants/events.js';
import { getOtherMember } from '../lib/helper.js';
import { TryCatch } from '../middlewares/error.js';
import Chat from '../models/chat.js';
import User from '../models/user.js';
import Message from '../models/message.js';
import { emitEvent } from '../utils/features.js';
import { ErrorHandler } from '../utils/utility.js';
const newChat = TryCatch(async (req, res) => {
  const { name, members } = req.body;

  const allMembers = [...members, req.user];
  await Chat.create({ name, members: allMembers });
  emitEvent(req, ALERT, allMembers, `Welcome to ${name}`);
  emitEvent(req, REFETCH_CHAT, members);

  return res.status(201).json({ message: 'Group chat created' });
});

const getMyChats = TryCatch(async (req, res) => {
  const chats = await Chat.find({ members: req.user }).populate(
    'members',
    'name avatar',
  );



  const Chats = await Promise.all(
    chats.map(async (chat) => {
      let members = getOtherMember(chat.members, req.user);
  
      const lastMessage = await Message.findOne({ chat: chat._id.toString() })
        .sort({ createdAt: -1 }) 
        .populate('sender', 'name avatar');
  
      return { ...chat._doc, members, lastMessage };
    })
  );

  return res.status(200).json({ Chats, message: 'Get All chat' });
});

const leaveChat = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
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

const sendAttachments = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;

  const files = req.files || [];
  if (!files.length < 1) return next(new ErrorHandler('No files found', 404));
  if(files.length > 5) return next(new ErrorHandler('You can only upload 5 files at a time', 400));


  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findByIdAndUpdate(req.user, 'name'),
  ]);

  if (!chat) {
    return next(new ErrorHandler('Chat not found', 404));
  }
  
  const attachments = [];
  const messageForDB = {
    content: ' ',
    attachments,
    sender: me._id,
    chat: chatId,
  };
  const messageForRealTime = {
    ...messageForDB,
    sender: {
      _id: me._id,
      name: me.name,
    },
    chat: chatId,
  };

  const message = await Message.create(messageForDB);
  emitEvent(req, NEW_ATTACHMENT, chat.members, {
    message: messageForRealTime,
    chatId,
  });
  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, {
    chatId,
  });
  return res.status(201).json({ message: message });
});

const getChatDetail = TryCatch(async (req, res, next) => {
  if (req.query.populate === 'true') {
    const chat = await Chat.findById(req.params.id)
      .populate('members', 'name avatar')
      .lean();
    if (!chat) {
      return next(new ErrorHandler('Chat not found', 404));
    }
    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));
    return res.status(200).json({ success: true, chat });
  } else {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return next(new ErrorHandler('Chat not found', 404));
    }
    return res.status(200).json({ success: true, chat });
  }
});

const renameGroup = TryCatch(async (req, res, next) => {
  const { name } = req.body;
  const chat = await Chat.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true },
  );
  if (!chat) {
    return next(new ErrorHandler('Chat not found', 404));
  }
  emitEvent(req, REFETCH_CHAT, chat.members);
  return res.status(200).json({ success: true, chat });
});

const deleteChat = TryCatch(async (req, res, next) => {
  const chat = await Chat.findByIdAndDelete(req.params.id);
  if (!chat) {
    return next(new ErrorHandler('Chat not found', 404));
  }
  emitEvent(req, REFETCH_CHAT, chat.members);
  return res.status(200).json({ success: true, message: 'Chat deleted' });
});

const getMessages = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const resultPerPage = 10;
  const { page = 1 } = req.query;
  const skip = (page - 1) * resultPerPage;
  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(resultPerPage)
      .populate('sender', 'name avatar')
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);
  const totalPages = Math.ceil(totalMessagesCount / resultPerPage);
  return res.status(200).json({
    success: true,
    messages: messages.reverse(),
    totalPages: totalPages,
  });
});

export {
  newChat,
  getMyChats,
  leaveChat,
  sendAttachments,
  getChatDetail,
  renameGroup,
  deleteChat,
  getMessages,
};
