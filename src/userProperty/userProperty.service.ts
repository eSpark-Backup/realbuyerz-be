/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { CreateUserPropertyDto } from "./dto/create-property.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";


@Injectable()
export class UserPropertyService {
    constructor(private readonly prismaService: PrismaService) { }

    async createProperty(user_id :string, createProperty: CreateUserPropertyDto) {

        const property = { ...createProperty }
        property.userId = user_id;
        property.propertyBy = "user";
       
        if (property.propertyPrice) {
            property.propertyPrice = parseInt(property.propertyPrice);

        }
        if (property.count) {
            property.count = parseInt(property.count);
        }

        try {
            const result = await this.prismaService.property.create({
                data: {
                    user: { connect: { id: property.userId } },
                    propertyName: property.propertyName,
                    propertyType: property.propertyType,
                    subType: property.subType,
                    purpose: property.purpose,
                    propertyPrice: property.propertyPrice,
                    propertyArea: property.propertyArea,
                    propertyCity: property.propertyCity,
                    propertyBy: property.propertyBy,
                    propertyAddress: property.propertyAddress,
                    propertyZip: property.propertyZip,
                    propertyDescription: property.propertyDescription,
                    longitude: property.longitude,
                    latitude: property.latitude,

                    amenities: {
                        create: {
                            amenetiesName: JSON.stringify(property.amenitiesName),
                            count: property.count,
                            otherFeatures: JSON.stringify(property.otherFeatures),
                        },
                    },


                } as Prisma.PropertyCreateInput,
            });

            if (result) {
                const propertyResponse = {
                    action: 'create',
                    success: true,
                    message: 'Property created successfully for User',
                    data: result
                }

                return propertyResponse;


            } 
            else {
                return {
                    success: false,
                    message: 'Failed to create property.',
                    error: 'Property creation failed.',
                }
            }



        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to create property.',
                error: error.message,
            };
        }
    }
}