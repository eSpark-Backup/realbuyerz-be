/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BiddingController } from './bidding.controller';
import { BiddingService } from './bidding.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PropertyService } from 'src/Property/property.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BackblazeService } from 'src/utils/function/backblaze';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule], 
  controllers: [BiddingController],
  providers: [BiddingService,PrismaService,BackblazeService,PropertyService,JwtService],
  exports: [PropertyService],
})
export class BiddingModule {}


