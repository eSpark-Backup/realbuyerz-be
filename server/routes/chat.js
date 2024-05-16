/* eslint-disable prettier/prettier */
import express, { Router } from 'express';

import { isAuthenticated } from '../middlewares/auth.js';
import {
  newChat,
  getMyChats,
  leaveChat,
  sendAttachments,
  getChatDetail,
  renameGroup,
  deleteChat,
  getMessages,
  
} from '../controllers/chat.js';
import { attachmentsMulter } from '../middlewares/multer.js';
import { chatIdValidator, leaveChatValidator, newChatValidator, sendAttachmentsValidator, validateHandler } from '../lib/validators.js';
const router = express.Router();
router.use(isAuthenticated);
router.post('/new',newChatValidator(),validateHandler, newChat);
router.get('/my', getMyChats);
router.delete('/leave/:id',leaveChatValidator(),validateHandler, leaveChat);
router.post('/upload', attachmentsMulter,sendAttachmentsValidator(),validateHandler, sendAttachments);
router.get("/message/:id",chatIdValidator(),validateHandler, getMessages);
router.route("/:id").get(chatIdValidator(),validateHandler,getChatDetail).put(renameGroup).delete(leaveChatValidator(),validateHandler,deleteChat);
export default router;
