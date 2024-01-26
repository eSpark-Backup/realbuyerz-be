/* eslint-disable prettier/prettier */
import { Body, Controller, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { BiddingService } from './bidding.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateBidDto } from './dto/createBid.dto';
import { CreateBidPropertyDto } from './dto/createBidProperty.dto';
import { propertyImageFileInterceptor } from 'src/utils/propertyfile.interceptor';
import { getBidDTO } from './dto/getBid.dto';
import { updateProposalDTO } from './dto/update.proposal.dto';

@Controller('bidding')
@ApiBearerAuth()
@ApiTags('Bidding')
export class BiddingController {
    constructor(private readonly biddingService: BiddingService) { }


    @Post("multipleProperty")
    async createProposal(@Body() CreateBidDto: CreateBidDto) {
        return await this.biddingService.createBidding(CreateBidDto);
    }

    @Post("singleProperty")
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

    @Post("viewProposal/:user_property_id")
    async getBidding(@Param("user_property_id") user_property_id: string){
        return await this.biddingService.getBidding(user_property_id);
    }

    @Post("acceptProposal")
    async acceptProposal(@Body() acceptProposal:updateProposalDTO){
        return await this.biddingService.acceptProposal(acceptProposal);
    }

    @Post("rejectProposal")
    async rejectProposal(@Body() rejectProposal:updateProposalDTO){
        return await this.biddingService.rejectProposal(rejectProposal);
    }
    


}
