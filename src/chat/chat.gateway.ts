/* eslint-disable prettier/prettier */
// chat.gateway.ts
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { socketAuthenticator } from 'src/utils/guard/socket.authenticator'; // Import the socketAuthenticator

@Injectable()
@WebSocketGateway({
  namespace: '/socket',
  cors: {
    origin: [
      'http://localhost:8080',
      'http://localhost',
      'http://localhost:3001',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');
  private userSocketIDs = new Map<string, string>();
  private onlineUsers = new Set<string>();

  afterInit(server: Server) {
    this.logger.log('WebSocket initialized');
  }

  // Now manually handle the authentication inside the handleConnection
  async handleConnection(socket: any) {
    try {
      // Call the socketAuthenticator middleware manually here
      await new Promise((resolve, reject) => {
        socketAuthenticator(null, socket, (err) => {
          if (err) {
            reject(err); // Reject if there's an authentication error
          } else {
            resolve(socket); // Resolve if authentication is successful
          }
        });
      });

      const userId = socket.user._id.toString() as string;
      if (userId) {
        this.userSocketIDs.set(userId, socket.id);
        this.onlineUsers.add(userId);
        this.server.emit('ONLINE_USERS', Array.from(this.onlineUsers));
        this.logger.log(`User connected: ${userId}`);
      } else {
        this.logger.warn('User ID is missing');
        socket.disconnect(true); // Disconnect if the userId is missing
      }
    } catch (error) {
      // Handle authentication error (e.g., 401 Unauthorized)
      this.logger.error('Authentication failed:', error.message);
      console.error(error);
      socket.disconnect(true); // Disconnect the socket
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = Array.from(this.userSocketIDs.keys()).find(
      (key) => this.userSocketIDs.get(key) === socket.id,
    );
    if (userId) {
      this.userSocketIDs.delete(userId);
      this.onlineUsers.delete(userId);
      this.server.emit('ONLINE_USERS', Array.from(this.onlineUsers));
      this.logger.log(`User disconnected: ${userId}`);
    }
  }

  /**
   * Emits a generic event to specific users.
   * @param event - The event name to emit.
   * @param users - Array of user IDs to emit the event to.
   * @param data - Data to include in the event.
   */
  emitEvent(event: string, users: string[], data: any) {
    const sockets = users
      .map((user) => this.userSocketIDs.get(user))
      .filter(Boolean);

    if (sockets.length) {
      this.server.to(sockets).emit(event, data);
    }
  }
}
