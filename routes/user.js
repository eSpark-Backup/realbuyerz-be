/* eslint-disable prettier/prettier */
import express from 'express';

import {
  newUser,
  loginUser,
  getMyProfile,
  logOutUser,
  sendRequest,
  acceptRequest,
  getMyNotifications,
  getMyFriends,
} from '../controllers/user.js';
import { singleAvatar } from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';
import {
    acceptRequestValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  validateHandler,
} from '../lib/validators.js';

const router = express.Router();

router.post(
  '/new',
  singleAvatar,
  registerValidator(),
  validateHandler,
  newUser,
);
router.post('/login', loginValidator(), validateHandler, loginUser);

// after here user must be logged in to access route below
router.use(isAuthenticated);
router.get('/profile', getMyProfile);
router.get('/logout', logOutUser);
router.put(
  '/sendRequest',
  sendRequestValidator(),
  validateHandler,
  sendRequest,
);
router.put(
    '/acceptRequest',
    acceptRequestValidator(),
    validateHandler,
    acceptRequest,
  );

  router.get(
    '/notifications',
    getMyNotifications,
  );
  router.get(
    '/friends',
    getMyFriends,
  );


export default router;
