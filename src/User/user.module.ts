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

@Module({
  imports: [PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.TOKEN_KEY || 'realbuyerzsecretkey',
      signOptions: {
        expiresIn: process.env.TOKEN_EXPIRY || '1d',
      },
    }),
  ], 
  controllers: [UserController], 
  providers: [UserService,PrismaService,JwtStrategy], 
  exports: [UserService], 
})
export class UserModule {}
