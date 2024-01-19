/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserPropertyController } from './userProperty.controller';
import { UserPropertyService } from './userProperty.service';


@Module({
  imports: [PrismaModule], 
  controllers: [UserPropertyController],
  providers: [UserPropertyService,PrismaService],
  exports: [UserPropertyService],
})
export class UserPropertyModule {}
