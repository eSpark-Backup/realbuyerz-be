/* eslint-disable prettier/prettier */
// src/user/module/user.module.ts

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthMiddleware } from 'src/auth/jwt.auth-gaurd';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [PrismaModule], 
  controllers: [UserController], 
  providers: [UserService,PrismaService,AuthMiddleware], 
  exports: [UserService], 
})
export class UserModule {}
