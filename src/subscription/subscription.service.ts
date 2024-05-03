/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSubscription(createSubscription: CreateSubscriptionDto) {
    try {
      const subscription: Prisma.SubscriptionCreateInput = {
        name: createSubscription.name,
        price: createSubscription.price,
        listing: createSubscription.listing,
        connects: createSubscription.connects,
        description: createSubscription.description,
      };
      const result = await this.prismaService.subscription.create({
        data: subscription,
      });

      return {
        success: true,
        message: 'Subscription Created Successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create subscription.',
        error: error.message,
      };
    }
  }
}
