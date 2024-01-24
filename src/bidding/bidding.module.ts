/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BiddingController } from './bidding.controller';
import { BiddingService } from './bidding.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PropertyService } from 'src/Property/property.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule], 
  controllers: [BiddingController],
  providers: [BiddingService,PrismaService],
  exports: [PropertyService],
})
export class BiddingModule {}
