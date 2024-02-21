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

@Injectable()
export class BiddingService {
    private readonly propertyService: PropertyService;

    constructor(
        private readonly prismaService: PrismaService,
        propertyService: PropertyService,
    ) {
        this.propertyService = propertyService;
    }
    async createBidding(createBid: CreateBidDto) {

        try {
            const propertyIds = createBid.agent_property_id.map(id =>id);

            const result = await this.prismaService.bidding.createMany({
                data: propertyIds.map(agent_property_id => ({
                    agent_property_id: agent_property_id,
                    user_property_id: createBid.user_property_id,
                })),

            });


            const rowCount = await this.prismaService.bidding.count({
                where: {
                    user_property_id: createBid.user_property_id,
                },
            });

            await this.prismaService.property.update({
                where: {
                    id: createBid.user_property_id,
                },
                data: {
                    proposal_count: rowCount,
                },
            });

            return { success: true, message: 'Proposal created successfully', response: { Bidding: { result } } };


        }
        catch (error) {
            throw error;
        }



    }

    async createSingleProperty(user_id: string, files: { image?: Express.Multer.File[] }, createProperty: CreateBidPropertyDto) {

        createProperty.user_id = user_id;

        const response = await this.propertyService.createProperty(user_id,files, createProperty);
        function isPropertyResponse(response: any): response is { success: boolean; message: any; response: { Property: { result: { id: string } } } } {
            return 'response' in response && 'Property' in response.response && 'result' in response.response.Property;
        }

        const propertyId = isPropertyResponse(response) ? response.response.Property.result.id : undefined;


        if (response) {

            if (response.success === true) {
                const result = await this.prismaService.bidding.create({
                    data: ({
                        agent_property_id: propertyId,
                        user_property_id: createProperty.user_property_id,
                    }),
                });


                const rowCount = await this.prismaService.bidding.count({
                    where: {
                        user_property_id: createProperty.user_property_id,
                    },
                });

                await this.prismaService.property.update({
                    where: {
                        id: createProperty.user_property_id,
                    },
                    data: {
                        proposal_count: rowCount,
                    },
                });

                return { success: true, message: 'Proposal created successfully', response: { Bidding: { result } } };
            } else {
                // Return the message from the response
                return { success: false, message: response.message };
            }


        }
        else {

            const result = await this.prismaService.property.delete({
                where: {
                    id: propertyId,
                },


            });
            return result;
        }



    }

    async getBidding(user_property_id: string) {

        const result = await this.prismaService.bidding.findMany({
            where: {
                user_property_id: user_property_id,
            },
            include: {
                agentProperty: true,

            },
        });
        return result;
    }

    async getAgentBidding(agent_property_id: string) {
        const result = await this.prismaService.bidding.findMany({
            where: {
                agent_property_id: agent_property_id,
            },
            include: {
                userProperty: true,

            },
        });
        return result;

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
                    id: biddingEntry.id
                },
                data: {
                    agent_status: 'active',
                    user_status: 'accepted',
                    updated_at: new Date(),

                }
            });

            const allOtherBiddingEntries = await this.prismaService.bidding.findMany({
                where: {
                    NOT: {
                        id: biddingEntry.id
                    }
                }
            });
            
            for (const entry of allOtherBiddingEntries) {
                await this.prismaService.bidding.update({
                    where: {
                        id: entry.id
                    },
                    data: {
                        user_status: 'rejected',
                        agent_status: 'archive',
                        updated_at: new Date()
                    }
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
                    id: biddingEntry.id
                },
                data: {
                    agent_status: 'Archive',
                    user_status: 'Rejected',
                    updated_at: new Date(),
                }
            });

            return updatedBiddingEntry;
        } catch (error) {
            throw new Error(`Error accepting proposal: ${error.message}`);
        }

    }
}