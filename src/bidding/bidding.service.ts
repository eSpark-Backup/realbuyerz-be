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
            const propertyIds = createBid.agent_property_id.map(id => parseInt(id));

            const result = await this.prismaService.bidding.createMany({
                data: propertyIds.map(agent_property_id => ({
                    agent_property_id: agent_property_id,
                    user_property_id: parseInt(createBid.user_property_id),
                    status: createBid.status,
                    proposal_count: 0,
                })),

            });

            return result;
            

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
            const result = await this.prismaService.bidding.create({
                data: ({
                    agent_property_id: propertyId,
                    user_property_id: parseInt(createProperty.user_property_id),
                    status: createProperty.status,
                    proposal_count: 0,
                }),

            });
            
            return result;
            
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

    async getBidding(getBiddingDto: getBidDTO) {

       const result = await this.prismaService.bidding.findMany({
            where: {
                user_property_id: parseInt(getBiddingDto.user_property_id),
            },
          include  : {
                agentProperty: true,
            },
        });
        return result;
}
}