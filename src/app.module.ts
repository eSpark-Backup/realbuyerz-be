/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './User/user.module';
import { PropertyModule } from './Property/property.module';
import { UserPropertyModule } from './userProperty/userProperty.module';
import { BiddingModule } from './bidding/bidding.module';

@Module({
  imports: [PrismaModule, UserModule, PropertyModule, UserPropertyModule, BiddingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}

