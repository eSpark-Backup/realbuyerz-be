/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, AdminGuard } from 'src/utils/guard';
import { SubscriptionService } from './subscription.service';
import { Roles } from 'src/utils/decorator/role.decorator';
import { swaggerDocs } from 'src/utils/decorator/swagger.decorator';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('subscription')
@ApiBearerAuth('jwt')
@ApiTags('Subscription')
@UseGuards(JwtAuthGuard, AdminGuard)
@Roles('admin')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  async getSubscription() {
    return 'Subscription Created Successfully';
  }
  @Post()
  @swaggerDocs({
    summary: 'Create Subscription',
    type: CreateSubscriptionDto,
    goodResponse: {
      status: 201,
      type: 'string',
      description: 'Subscription Created Successfully',
    },
    badresponse: { status: 400, type: 'string', description: 'Bad Request' },
  })
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionService.createSubscription(createSubscriptionDto);
  }

  @Put(':id')
  async updateSubscription() {
    return 'Subscription Updated Successfully';
  }

  @Delete(':id')
  async deleteSubscription() {
    return 'Subscription Deleted Successfully';
  }
}
