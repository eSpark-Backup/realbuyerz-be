/* eslint-disable prettier/prettier */
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ChatUser } from 'src/models/user';
import { MongoConnectionManager } from './mongo.connection';

export const socketAuthenticator = async (err, socket, next) => {
  try {
    // Ensure MongoDB is connected before proceeding
    const mongoConnectionManager = new MongoConnectionManager();
    if (!mongoConnectionManager.isConnected) {
      await mongoConnectionManager.connect(); // Wait for the connection to be established
    }

    if (err) return next(err);

    // Extract token from Authorization header or query parameters
    const authToken =
      socket.request.headers.authorization?.split(' ')[1] ||
      socket.handshake.query.token;

    if (!authToken) {
      throw new UnauthorizedException('Please login to access this resource');
    }

    // Verify token and fetch user
    const decodedData = jwt.verify(authToken, process.env.TOKEN_KEY);
    if (typeof decodedData !== 'string' && 'chatId' in decodedData) {
      const user = await ChatUser.findById(decodedData.chatId);
      if (!user) {
        throw new UnauthorizedException('Please login to access this resource');
      }
      socket.user = user;
      return next();
    } else {
      throw new UnauthorizedException('Please login to access this resource');
    }
  } catch (error) {
    return next(error);
  }
};
