/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';


@Module({
  imports: [PrismaModule], 
  controllers: [SubscriptionController],
  providers: [SubscriptionService,PrismaService,JwtService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
