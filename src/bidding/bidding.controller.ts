/* eslint-disable prettier/prettier */
import { Controller, Post } from '@nestjs/common';
import { BiddingService } from './bidding.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('bidding')
@ApiBearerAuth()
@ApiTags('Bidding')
export class BiddingController {
    constructor(private readonly biddingService: BiddingService) { }


    @Post()
    @ApiTags('Bidding')
    async createBidding() {
        return this.biddingService.createBidding();
    }
}
