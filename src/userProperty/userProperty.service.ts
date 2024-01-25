/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { CreateUserPropertyDto } from "./dto/create-property.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { generateResponse } from "src/utils/response";


@Injectable()
export class UserPropertyService {
    constructor(private readonly prismaService: PrismaService) { }

    async createProperty(createProperty: CreateUserPropertyDto) {

        const property = { ...createProperty }
        property.property_by = "user";
        if (property.user_id) {
            property.user_id = parseInt(property.user_id);
        }
        if (property.property_price) {
            property.property_price = parseInt(property.property_price);

        }
        if (property.count) {
            property.count = parseInt(property.count);
        }

        try {
            const result = await this.prismaService.property.create({
                data: {
                    user: { connect: { id: property.user_id } },
                    property_name: property.property_name,
                    property_type: property.property_type,
                    sub_type: property.sub_type,
                    purpose: property.purpose,
                    property_price: property.property_price,
                    property_area: property.property_area,
                    property_city: property.property_city,
                    property_by: property.property_by,
                    property_address: property.property_address,
                    property_zip: property.property_zip,
                    property_description: property.property_description,
                    longitude: property.longitude,
                    latitude: property.latitude,

                    amenities: {
                        create: {
                            ameneties_name: JSON.stringify(property.amenities_name),
                            count: property.count,
                            other_features: JSON.stringify(property.other_features),
                        },
                    },


                } as Prisma.PropertyCreateInput,
            });

            if (result) {
                const propertyResponse = generateResponse("Created User Property Request Data", "Property Request for User Created successfully", { result }, "Property");

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