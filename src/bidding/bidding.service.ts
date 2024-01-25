/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBidDto } from './dto/createBid.dto';
import { CreateBidPropertyDto } from './dto/createBidProperty.dto';
import { PropertyService } from 'src/Property/property.service';
import { PropertyModule } from 'src/Property/property.module';

@Injectable()
export class BiddingService {
    private readonly propertyService: PropertyService;

    constructor(
        private readonly prismaService: PrismaService,
        propertyService: PropertyService, // Inject PropertyService
    ) {
        this.propertyService = propertyService;
    }
    async createBidding(createBid: CreateBidDto) {

        try {
            const propertyIds = createBid.property_id.map(id => parseInt(id));
            const agentPropertyResults = await this.prismaService.agentProperty.createMany({
                data: propertyIds.map(property_id => ({
                    bidding_id: parseInt(createBid.bidding_id),
                    property_id: property_id,
                    status: createBid.status,
                })),
            });

            if (agentPropertyResults) {
                const updatedBidding = await this.prismaService.bidding.update({
                    where: {
                        id: parseInt(createBid.bidding_id),
                    },
                    data: {
                        proposal_count: {
                            increment: 1,
                        },
                        updated_at: new Date(),
                    },
                });
                if (updatedBidding) {
                    return {
                        status: true,
                        message: 'Proposal created successfully',
                    };
                }
                else {
                    return {
                        status: false,
                        message: 'Proposal not created',
                    };
                }

            }
        }
        catch (error) {
            throw error;
        }



    }

    async createSingleProperty(files: { image?: Express.Multer.File[] }, createProperty: CreateBidPropertyDto) {

        const response = await this.propertyService.createProperty(files, createProperty);
        function isPropertyResponse(response: any): response is { success: boolean; message: any; response: { Property: { result: { id: number } } } } {
            return 'response' in response && 'Property' in response.response && 'result' in response.response.Property;
          }
          
          const propertyId = isPropertyResponse(response) ? response.response.Property.result.id : undefined;
          

        if (response) {
            const agentPropertyResults = await this.prismaService.agentProperty.createMany({
                data:  ({
                    bidding_id: parseInt(createProperty.bidding_id),
                    property_id: propertyId,
                    status: createProperty.status,
                }),
            });
            if (agentPropertyResults) {
                const updatedBidding = await this.prismaService.bidding.update({
                    where: {
                        id: parseInt(createProperty.bidding_id),
                    },
                    data: {
                        proposal_count: {
                            increment: 1,
                        },
                        updated_at: new Date(),
                    },
                });
                if (updatedBidding) {
                    return {
                        status: true,
                        message: 'Proposal created successfully',
                    };
                }
                else {
                    return {
                        status: false,
                        message: 'Proposal not created',
                    };
                }

            }
        }
        else {
            return {
                status: false,
                message: 'Property not created',
            };
        }



    }

}
