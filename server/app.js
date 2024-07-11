/* eslint-disable prettier/prettier */
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer as CreateServer } from 'http';
import { connectDbWithRetries } from './utils/features.js';
import userRoute from './routes/user.js';
import chatRoute from './routes/chat.js';
import adminRoute from './routes/admin.js';
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from './constants/events.js';
import { getSockets } from './lib/helper.js';
import { corsOptions } from './constants/config.js';
import Message from './models/message.js';
import { socketAuthenticator } from './middlewares/auth.js';
const app = express();
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';
import { v4 as uuid } from 'uuid';
import { errorMiddleware } from './middlewares/error.js';
import http from 'http'
import {
  createMessage,
  createMessagesInChat,
  createSingleChats,
  createUSer,
} from './seeder/user.js';
const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions

});

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

dotenv.config();



const userSocketIds = new Map();
// connectDb(process.env.URI);
const options = { reconnectTries: 3, reconnectTimeout: 10000 }; // 3 retries, 10 seconds between retries

connectDbWithRetries(process.env.URI, options)
  .then(() => console.log('Database connection established with retries'))
  .catch((err) => console.error('Failed to connect to database after retries:', err));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  
})
//seeders
// createMessage(10);
//  createMessagesInChat("66433c40348963b325b0be74",10)

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/user', userRoute);
app.use('/chat', chatRoute);
app.use('/admin', adminRoute);

io.use((socket, next) => {

  const cookie = socket.handshake.headers.cookie;

  cookieParser()(socket.request, socket.request.res, async (err) => {
    console.log(socket.request.cookies['badami']);
    await socketAuthenticator(err, socket, next);
  });
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  const user = {
    _id: 'fasfasf',
    name: 'John Doe',
  };
  userSocketIds.set(user._id.toString(), socket.id);
  console.log(userSocketIds);

  socket.on(NEW_MESSAGE, async ({ chatId, members, messages }) => {
    const messageForRealTime = {
      content: messages,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };
    const messageForDB = {
      content: messages,
      sender: user._id,
      chat: chatId,
    };
    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(NEW_MESSAGE, {
      message: messageForRealTime,
      chatId,
    });
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, {
      chatId,
    });
    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on('disconnect', () => {
    userSocketIds.delete(user._id.toString());
    console.log('user disconnected', socket.id);
  });
});
app.use(errorMiddleware);

server.listen(port, () => {
  console.log(
    `Server is running on port ${port} in ${process.env.NODE_ENV} mode`,
  );
});

export { userSocketIds };
