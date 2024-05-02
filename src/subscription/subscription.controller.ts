/* eslint-disable prettier/prettier */
import { Controller, Delete, Get, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard, AdminGuard } from "src/utils/guard";
import { SubscriptionService } from "./subscription.service";
import { Roles } from "src/utils/decorator/role.decorator";

@Controller('subscription')
@ApiBearerAuth('jwt')
@ApiTags('Subscription')
@UseGuards(JwtAuthGuard, AdminGuard)
@Roles('admin')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) { }

  @Get()
  async getSubscription() {
    return  "Subscription Created Successfully"
  }
  @Post()
  async createSubscription() {
    return  "Subscription Created Successfully"
  }

  @Put(':id')
  async updateSubscription() {
    return  "Subscription Updated Successfully"
  }

  @Delete(':id')
  async deleteSubscription() {
    return  "Subscription Deleted Successfully"
  }




}