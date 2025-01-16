/* eslint-disable prettier/prettier */
// mongo.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
console.log(process.env.MONGODB_URL);
@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URL, {})],
})
export class MongoModule {}
