/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BiddingService } from './bidding.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateBidDto } from './dto/createBid.dto';
import { CreateBidPropertyDto } from './dto/createBidProperty.dto';
import { propertyImageFileInterceptor } from 'src/utils/interceptor/propertyfile.interceptor';
import { JwtAuthGuard, RoleGuard } from 'src/utils/guard';
import { Roles } from 'src/utils/decorator/role.decorator';
import { UserId } from 'src/utils/decorator/userId.decorator';
import { UserRoleGuard } from 'src/utils/guard/user.guard';
import { swaggerDocs } from 'src/utils/decorator/swagger.decorator';

@Controller('bidding')
@ApiBearerAuth('jwt')
export class BiddingController {
  constructor(private readonly biddingService: BiddingService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('agent')
  @Post('multipleProperty')
  async createProposal(@Body() CreateBidDto: CreateBidDto) {
    return await this.biddingService.createBidding(CreateBidDto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiTags('Agent Bidding')
  @Roles('agent')
  @swaggerDocs({
    summary: 'Bid Request By Creating a Property (Apply Now for Agent)',
    type: null,
    goodResponse: {
      status: 201,
      description: 'Bid on a Request From Agent Created Successfully',
    },
    badresponse: { status: 400, description: 'Properties Not Found' },
  })
  @Post('singleProperty')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(propertyImageFileInterceptor)
  async createSingleProperty(
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
    @UserId() userId: string,
    @Body() createBidPropertyDto: CreateBidPropertyDto,
  ) {
    return await this.biddingService.createSingleProperty(
      userId,
      files,
      createBidPropertyDto,
    );
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @Roles('user')
  @ApiTags('User/Customer Bidding')
  @Get('viewProposal/:user_property_id')
  async getBidding(@Param('user_property_id') user_property_id: string) {
    return await this.biddingService.getBidding(user_property_id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiTags('Agent Bidding')
  @Roles('agent')
  @swaggerDocs({
    summary:
      'View All Agent Proposals which are sent to a User/Customer Request ',
    type: null,
    goodResponse: {
      status: 201,
      description: 'Bid on a Request From Agent Created Successfully',
    },
    badresponse: { status: 400, description: 'Properties Not Found' },
  })
  @Get('viewAgentProposal/:agent_property_id')
  async getAgentBidding(@Param('agent_property_id') agent_property_id: string) {
    return await this.biddingService.getAgentBidding(agent_property_id);
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @Roles('user')
  @ApiTags('User/Customer Bidding')
  @Post('acceptProposal/:id')
  async acceptProposal(@Param('id') id: string) {
    return await this.biddingService.acceptProposal(id);
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @Roles('user')
  @ApiTags('User/Customer Bidding')
  @Post('rejectProposal/:id')
  async rejectProposal(@Param('id') id: string) {
    return await this.biddingService.rejectProposal(id);
  }
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @Roles('user')
  @ApiTags('User/Customer Bidding')
  @Post('archiveProposal/:id')
  async archiveProposal(@Param('id') id: string) {
    return await this.biddingService.archiveProposal(id);
  }
}
