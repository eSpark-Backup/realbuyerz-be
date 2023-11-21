/* eslint-disable prettier/prettier */
// src/user/module/user.module.ts

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule], 
  controllers: [UserController], 
  providers: [UserService,PrismaService], 
  exports: [UserService], 
})
export class UserModule {}
