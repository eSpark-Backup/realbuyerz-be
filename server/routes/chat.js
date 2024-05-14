/* eslint-disable prettier/prettier */
import express, { Router } from 'express';

import { isAuthenticated } from '../middlewares/auth.js';
import {
  newGroupChat,
  getMyChats,
  leaveChat,
  sendAttachments,
  getChatDetail,
  renameGroup,
  deleteChat,
  getMessages
} from '../controllers/chat.js';
import { attachmentsMulter } from '../middlewares/multer.js';
const router = express.Router();
router.use(isAuthenticated);
router.post('/new', newGroupChat);
router.get('/my', getMyChats);
router.delete('/leave/:id', leaveChat);
router.post('/upload', attachmentsMulter, sendAttachments);
router.get("/message/:id", getMessages);
router.route("/:id").get(getChatDetail).put(renameGroup).delete(deleteChat);
export default router;
