/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [PrismaModule,
    MulterModule.register({
      dest: './uploads',
    }),], 
  controllers: [PropertyController],
  providers: [PropertyService,PrismaService],
  exports: [PropertyService],
})
export class PropertyModule {}
