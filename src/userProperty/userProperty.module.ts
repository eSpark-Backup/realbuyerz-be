/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserPropertyController } from './userProperty.controller';
import { UserPropertyService } from './userProperty.service';
import { JwtService } from '@nestjs/jwt';
import { BackblazeService } from 'src/utils/function/backblaze';

@Module({
  imports: [PrismaModule],
  controllers: [UserPropertyController],
  providers: [UserPropertyService, PrismaService, JwtService, BackblazeService],
  exports: [UserPropertyService],
})
export class UserPropertyModule {}
