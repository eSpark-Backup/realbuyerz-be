/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BiddingService {
    constructor(private readonly prismaService: PrismaService) { }

    async createBidding() {
        return "Bidding created successfully";
    }
    
}
