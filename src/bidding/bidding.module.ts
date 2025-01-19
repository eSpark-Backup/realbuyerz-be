/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BiddingController } from './bidding.controller';
import { BiddingService } from './bidding.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PropertyService } from 'src/Property/property.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BackblazeService } from 'src/utils/function/backblaze';
import { JwtService } from '@nestjs/jwt';
import { chatSchema } from 'src/models/chat';
import { MongooseModule } from '@nestjs/mongoose';
import { notificationSchema } from 'src/models/notifications';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    PrismaModule,
    MongooseModule.forFeature([
      { name: 'Chat', schema: chatSchema },
      { name: 'Notification', schema: notificationSchema },
    ]),
    ChatModule,
  ],
  controllers: [BiddingController],
  providers: [
    BiddingService,
    PrismaService,
    BackblazeService,
    PropertyService,
    JwtService,
  ],
  exports: [PropertyService],
})
export class BiddingModule {}
