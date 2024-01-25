/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { BiddingService } from './bidding.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateBidDto } from './dto/createBid.dto';
import { CreateBidPropertyDto } from './dto/createBidProperty.dto';
import { propertyImageFileInterceptor } from 'src/utils/propertyfile.interceptor';

@Controller('bidding')
@ApiBearerAuth()
@ApiTags('Bidding')
export class BiddingController {
    constructor(private readonly biddingService: BiddingService) { }


    @Post("proposal")
    @ApiTags('Bidding')
    async createProposal(@Body() CreateBidDto: CreateBidDto) {
        return await this.biddingService.createBidding(CreateBidDto);
    }

    @Post("singleProperty")
    @ApiTags('Bidding')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(propertyImageFileInterceptor)
    async createSingleProperty( @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
    @Body() createBidPropertyDto: CreateBidPropertyDto,
  ) {
        return await this.biddingService.createSingleProperty(files,createBidPropertyDto);
    }


}
