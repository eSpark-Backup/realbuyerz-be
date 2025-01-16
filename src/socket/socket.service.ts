/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as redis from 'redis';
import * as redisAdapter from 'socket.io-redis';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  private pubClient = redis.createClient();
  private subClient = redis.createClient();

  constructor() {
    // Redis Adapter to enable Socket.io cross-communication
    const io = new Server(); // You would already have your Socket.io instance here
    io.adapter(
      redisAdapter({ pubClient: this.pubClient, subClient: this.subClient }),
    );
  }

  // Example method to emit an event
  emitNewMessage(event: string, members: any[], data: any) {
    // Emit to users using their socket IDs stored in Redis
    const io = new Server(); // Initialize the same io instance as used in Express
    const userSockets = this.getSockets(members); // Your logic to fetch socket IDs from Redis
    io.to(userSockets).emit(event, data);
  }

  private getSockets(users: any[]): string[] {
    // Implement logic to retrieve socket IDs for the users (could query Redis)
    return users.map((user) => user.socketId); // Example, assuming user contains socketId
  }
}
