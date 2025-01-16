/* eslint-disable prettier/prettier */
// src/user/module/user.module.ts

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { BackblazeService } from 'src/utils/function/backblaze';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from '../models/user';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.TOKEN_KEY || 'realbuyerzsecretkey',
      signOptions: {
        expiresIn: process.env.TOKEN_EXPIRY || '1d',
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtStrategy, BackblazeService],
  exports: [UserService],
})
export class UserModule {}
