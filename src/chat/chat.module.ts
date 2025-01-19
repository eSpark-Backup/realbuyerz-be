/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/models/user';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
