/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BackblazeService } from 'src/utils/backblaze';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [PrismaModule], 
  controllers: [PropertyController],
  providers: [PropertyService,BackblazeService,PrismaService,JwtService],
  exports: [PropertyService],
})
export class PropertyModule {}
