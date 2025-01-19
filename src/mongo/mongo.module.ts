/* eslint-disable prettier/prettier */
// mongo.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
console.log(process.env.MONGODB_URL);
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      minPoolSize: 10, // Adjust pool size based on your traffic
      socketTimeoutMS: 30000, // Example timeout settings
      connectTimeoutMS: 30000,
    }),
  ],
})
export class MongoModule {}
