/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBidDto } from './dto/createBid.dto';
import { CreateBidPropertyDto } from './dto/createBidProperty.dto';
import { PropertyService } from 'src/Property/property.service';
import { PropertyModule } from 'src/Property/property.module';
import { getBidDTO } from './dto/getBid.dto';
import { response } from 'express';
import { updateProposalDTO } from './dto/update.proposal.dto';
import { Chat } from 'src/models/chat';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from 'src/models/notifications';
import { ChatGateway } from 'src/chat/chat.gateway';
import { Message } from 'src/models/message';

@Injectable()
export class BiddingService {
  private readonly propertyService: PropertyService;

  constructor(
    private chatGateway: ChatGateway,
    private readonly prismaService: PrismaService,
    @InjectModel('Chat') private readonly chatModel: Model<typeof Chat>,
    @InjectModel('Notification')
    private readonly notificationModel: Model<typeof Notification>,
    @InjectModel('Message')
    private readonly messageModel: Model<typeof Message>,

    propertyService: PropertyService,
  ) {
    this.propertyService = propertyService;
  }
  async createBidding(createBid: CreateBidDto) {
    try {
      const propertyIds = createBid.agentPropertyId.map((id) => id);

      const result = await this.prismaService.bidding.createMany({
        data: propertyIds.map((agentPropertyId) => ({
          agentPropertyId: agentPropertyId,
          userPropertyId: createBid.userPropertyId,
        })),
      });

      const rowCount = await this.prismaService.bidding.count({
        where: {
          userPropertyId: createBid.userPropertyId,
        },
      });

      await this.prismaService.property.update({
        where: {
          id: createBid.userPropertyId,
        },
        data: {
          proposalCount: rowCount,
        },
      });

      return {
        success: true,
        message: 'Proposal created successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async createSingleProperty(
    user_id: string,
    files: { image?: Express.Multer.File[] },
    createProperty: CreateBidPropertyDto,
  ) {
    createProperty.userId = user_id;
    const property = await this.prismaService.property.findUnique({
      where: {
        id: createProperty.userPropertyId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            address: true,
            profileImage: true,
            socialId: true,
            bio: true,
            chatId: true,
          },
        },
      },
    });

    if (!property) {
      throw new Error('User Property does not exist');
    }

    const response = await this.propertyService.createProperty(
      user_id,
      files,
      createProperty,
    );
    function hasData(response: any): response is {
      success: boolean;
      action?: string;
      message: string;
      data: any;
    } {
      return 'data' in response;
    }
    let propertyId;
    if (response.message && hasData(response)) {
      {
        propertyId = response.data.id;
      }
    } else {
      return response;
    }

    if (response) {
      if (response.success === true) {
        const result = await this.prismaService.bidding.create({
          data: {
            agentPropertyId: propertyId,
            userPropertyId: createProperty.userPropertyId,
          },
        });

        const rowCount = await this.prismaService.bidding.count({
          where: {
            userPropertyId: createProperty.userPropertyId,
          },
        });

        await this.prismaService.property.update({
          where: {
            id: createProperty.userPropertyId,
          },
          data: {
            proposalCount: rowCount,
          },
        });
        const user = await this.prismaService.user.findUnique({
          where: {
            id: user_id,
          },
        });
        const members = [user.chatId, property.user.chatId];
     const chat=   await this.chatModel.create({
          members,
          name: `Bid For ${property.propertyName} at Price ${createProperty.propertyPrice}`,
          creator: user.chatId,
          biddingId: result.id,
        });
        await this.notificationModel.create({
          message: `Bid For ${property.propertyName} at Price ${createProperty.propertyPrice}`,
          user: property.user.chatId,
          type: 'info',
          title: 'New Bid',
          propertyId: propertyId,
        });

        await this.messageModel.create({
          message: `Hi ${property.user.firstName}, please check review my bid For ${property.propertyName} at Price ${createProperty.propertyPrice}`,
          chat: chat.id.toString(),
          sender: user.chatId,
        });
        this.chatGateway.emitEvent('NEW_BIDDING', [property.user.chatId], {
          content: `Bid For ${property.propertyName} at Price ${createProperty.propertyPrice}`,
          title: 'New Bid',
          type: 'info',
          propertyId: propertyId,
        });


        this.chatGateway.emitEvent('REFETCH_CHATS', members, {});

        return {
          success: true,
          message: 'Proposal created successfully',
          response: { Bidding: { result } },
        };
      } else {
        // Return the message from the response
        return { success: false, message: response.message };
      }
    } else {
      const result = await this.prismaService.property.delete({
        where: {
          id: propertyId,
        },
      });
      return result;
    }
  }

  async getBidding(user_property_id: string) {
    const userProperty = await this.prismaService.property.findUnique({
      where: { id: user_property_id },
      include: {
        amenities: true,
        propertyType: true,
      },
    });
    const items = await this.prismaService.bidding.findMany({
      where: {
        userPropertyId: user_property_id,
      },
      include: {
        agentProperty: {
          include: {
            PropertyData: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                address: true,
                profileImage: true,
                socialId: true,
                bio: true,
              },
            },
            amenities: true,
            propertyType: true,
          },
        },
      },
    });
    return {
      success: true,
      message: 'Bidding retrieved successfully',
      data: { items, userProperty },
    };
  }

  async getAgentBidding(agent_property_id: string) {
    const agentProperty = await this.prismaService.property.findUnique({
      where: { id: agent_property_id },
      include: {
        amenities: true,
        PropertyData: true,
        propertyType: true,
      },
    });

    const userBiddings = await this.prismaService.bidding.findMany({
      where: {
        agentPropertyId: agent_property_id,
      },
      include: {
        userProperty: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                address: true,
                profileImage: true,
                socialId: true,
                bio: true,
              },
            },
            amenities: true,
            propertyType: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Bidding retrieved successfully',

      data: userBiddings.map((bidding) => ({
        ...bidding,
        agentProperty,
      })),
    };
  }

  async acceptProposal(id: string) {
    try {
      const biddingEntry = await this.prismaService.bidding.findFirst({
        where: {
          id: id,
        },
      });

      if (!biddingEntry) {
        throw new Error('Bidding entry not found');
      }

      const updatedBiddingEntry = await this.prismaService.bidding.update({
        where: {
          id: biddingEntry.id,
        },
        data: {
          agentStatus: 'active',
          userStatus: 'accepted',
        },
      });

      const allOtherBiddingEntries = await this.prismaService.bidding.findMany({
        where: {
          NOT: {
            id: biddingEntry.id,
          },
        },
      });

      for (const entry of allOtherBiddingEntries) {
        await this.prismaService.bidding.update({
          where: {
            id: entry.id,
          },
          data: {
            userStatus: 'rejected',
            agentStatus: 'rejected',
          },
        });
      }

      return updatedBiddingEntry;
    } catch (error) {
      throw new Error(`Error accepting proposal: ${error.message}`);
    }
  }

  async rejectProposal(id: string) {
    try {
      const biddingEntry = await this.prismaService.bidding.findFirst({
        where: {
          id: id,
        },
      });

      if (!biddingEntry) {
        throw new Error('Bidding entry not found');
      }

      const updatedBiddingEntry = await this.prismaService.bidding.update({
        where: {
          id: biddingEntry.id,
        },
        data: {
          userStatus: 'rejected',
          agentStatus: 'rejected',
        },
      });

      return updatedBiddingEntry;
    } catch (error) {
      throw new Error(`Error accepting proposal: ${error.message}`);
    }
  }

  async archiveProposal(id: string) {
    try {
      const biddingEntry = await this.prismaService.bidding.findFirst({
        where: {
          id: id,
        },
      });

      if (!biddingEntry) {
        throw new Error('Bidding entry not found');
      }

      const updatedBiddingEntry = await this.prismaService.bidding.update({
        where: {
          id: biddingEntry.id,
        },
        data: {
          agentStatus: 'archive',
          userStatus: 'archive',
        },
      });

      return updatedBiddingEntry;
    } catch (error) {
      throw new Error(`Error archiving proposal: ${error.message}`);
    }
  }
}
