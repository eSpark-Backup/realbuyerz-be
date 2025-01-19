/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class MongoConnectionManager {
  private readonly logger = new Logger(MongoConnectionManager.name);
  private mongooseInstance: mongoose.Mongoose | null = null;

  // Max retries before failing
  private readonly maxRetries = 5;
  private retryCount = 0;

  // Retry connection logic
  private async connectWithRetry(): Promise<void> {
    if (this.retryCount >= this.maxRetries) {
      this.logger.error('Max retries reached, MongoDB connection failed');
      throw new Error('MongoDB connection failed after retries');
    }

    try {
      this.retryCount += 1;
      this.logger.log(
        `Retrying MongoDB connection: Attempt ${this.retryCount}`,
      );
      await mongoose.connect(process.env.MONGODB_URL, {
        minPoolSize: 10,
        socketTimeoutMS: 60000,
        connectTimeoutMS: 60000,
      });

      this.logger.log('MongoDB connection established');
    } catch (error) {
      this.logger.error('MongoDB connection failed', error);
      setTimeout(() => this.connectWithRetry(), 5000); // Retry after 5 seconds
    }
  }

  async connect(): Promise<mongoose.Mongoose> {
    if (this.mongooseInstance) {
      return this.mongooseInstance;
    }

    await this.connectWithRetry();
    return mongoose;
  }

  // Disconnect if necessary
  async disconnect(): Promise<void> {
    if (this.mongooseInstance) {
      this.logger.log('Disconnecting from MongoDB...');
      await this.mongooseInstance.disconnect();
      this.logger.log('Disconnected from MongoDB');
      this.mongooseInstance = null;
    }
  }

  get isConnected(): boolean {
    return !!this.mongooseInstance;
  }
}
