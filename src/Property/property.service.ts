/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { extname, resolve } from 'path';
import * as path from 'path';
import * as  Sharp from 'sharp';
import { readFile } from 'fs/promises';
import { promises as fsPromises } from 'fs';
import { CreatePropertyDto } from './dto/create-property.dto';
import { updatedPropertyDto } from './dto/update-property.dto';
import { PropertyDataDTO } from './dto/create-propertyData.dto';
import { Prisma } from '@prisma/client';
import * as uuid from 'uuid';

@Injectable()
export class PropertyService {
    constructor(private readonly prismaService: PrismaService) { }
    

    private async saveImageToDisk(buffer: Buffer, filename: string): Promise<string> {
        function generateRandomUUID(): string {
            return uuid.v4();
          }
          const randomUUID = generateRandomUUID();
        const destinationFolder = 'upload';
        const filePath = path.join(destinationFolder, `${randomUUID}_${filename}`);

        await fsPromises.writeFile(filePath, buffer);
        return filePath;
    }


    private async processSingleImage(file: Express.Multer.File): Promise<any> {
        console.log('File:', file);

        const originalMetadata = await Sharp(file.path).metadata();
        const watermarkPath = 'src/Property/Quote.png';

        const buffer = await Sharp(file.path)
            .resize({ width: 600, height: 500, fit: 'cover' })
            .composite([{ input: await readFile(resolve(watermarkPath)), gravity: 'center' }])
            .png()
            .toBuffer();

        const resizedMetadata = await Sharp(buffer).metadata();

        console.log('Original Dimensions:', originalMetadata.width, 'x', originalMetadata.height);
        console.log('Resized Dimensions:', resizedMetadata.width, 'x', resizedMetadata.height);

        const dimensionsChanged =
            originalMetadata.width !== resizedMetadata.width ||
            originalMetadata.height !== resizedMetadata.height;

        console.log('Dimensions Changed:', dimensionsChanged);

        const savedImagePath = await this.saveImageToDisk(buffer, file.originalname);

        return {
            ...file,
            savedImagePath,
        };
    }

    async findbyuserId(user_id: string) {
        try {


            const userIdNumber = parseInt(user_id);

            const totalCount = await this.prismaService.property.count({
                where: {
                    user_id: userIdNumber,
                },
            });

            const properties = await this.prismaService.property.findMany({
                where: {
                    user_id: userIdNumber,
                },
                include: {
                    amenities: true,
                    Property_data: true,
                }


            }

            );
            return { totalCount, properties };
        } catch (error) {
            console.error('Error finding properties by user ID:', error.message);
            return { message: 'Failed to find properties by user ID', status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message };
        }
    }
    async createPropertyData(propertyData: PropertyDataDTO) {
        try {
            const result = await this.prismaService.porperty_data.create({
                data: propertyData,
            });

            return result;
        } catch (error) {
            console.error('Error processing property creation:', error.message);
            return { message: 'Failed to Create Property', status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message };
        }


    }
    async createProperty(files: { image?: Express.Multer.File[] }, createProperty: CreatePropertyDto) {


        if (files.image) {
            const allowedImageTypes = ['.png', '.jpeg', '.jpg'];
            for (const file of files.image) {
                const ext = extname(file.originalname);
                if (!allowedImageTypes.includes(ext)) {
                    throw new HttpException('Invalid image file type.', HttpStatus.BAD_REQUEST);
                }
            }
        }

        const maxFileSize = 4 * 1024 * 1024;
        for (const file of [...(files.image || [])]) {
            if (file.size > maxFileSize) {
                throw new HttpException('File size exceeds the limit.', HttpStatus.BAD_REQUEST);
            }
        }

        const property = { ...createProperty }
        let processedImages: any = [];
        if (property.user_id) {
            property.user_id = parseInt(property.user_id);
        }
        if (property.property_price) {
            property.property_price = parseInt(property.property_price);

        }
        if (property.count) {
            property.count = parseInt(property.count);
        }

        let result = null;
        try {
            result = await this.prismaService.property.create({
                data: {
                    user: { connect: { id: property.user_id } },
                    property_name: property.property_name,
                    property_type: property.property_type,
                    sub_type: property.sub_type,
                    purpose: property.purpose,
                    property_price: property.property_price,
                    property_area: property.property_area,
                    property_city: property.property_city,
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
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to create property.',
                error: error.message,
            };
        }


        try {
            // if(files.video && files.image){



            // }
            // else
            if (files.image) {
                processedImages = await Promise.all(files.image.map(file => this.processSingleImage(file)));


                const propertyData = processedImages.map(image => ({
                    url: image.savedImagePath,
                    type: 'image',
                    property_id: result.id,
                }));

                await this.prismaService.porperty_data.createMany({
                    data: propertyData,
                });

                const response = {
                    timestamp_ms: Date.now(),
                    action: 'Created Property Data',
                    Property: {
                        result
                    },

                };

                return { success: true, message: 'Property Created successfully', response };




            }
            // else if(files.video && !files.image){
            //     // files.video.map(file => this.processSingleImage(file));
            //     // const propertyData = processedImages.map(image => ({
            //     //     url: JSON.stringify(image.savedImagePath),
            //     //     type: 'video',
            //     //     property_id: result.id,
            //     // }));

            //     // const createdPropertyData = await this.prismaService.porperty_data.createMany({
            //     //     data: propertyData,
            //     // });

            // }
            else {
                return {
                    success: false,
                    message: 'No images/Videos provided for property creation.',
                };
            }


        }
        catch (error) {
            if (result && result.id) {
                await this.prismaService.property.delete({
                    where: { id: result.id },
                });


                return {
                    success: false,
                    message: 'Failed to create property.',
                    error: error.message,
                };
            }
        }












    }


    async updateProperty(property_id: string, files: { image?: Express.Multer.File[]}, updateProperty: updatedPropertyDto) {
        const property = { ...updateProperty }
        if (property.user_id) {
            property.user_id = parseInt(property.user_id);
        }
        if (property.property_price) {
            property.property_price = parseInt(property.property_price);

        }
        if (property.count) {
            property.count = parseInt(property.count);
        }

        if (property.property_status) {
            property.property_status = Boolean(property.property_status);
        }
        if (files.image) {
            const allowedImageTypes = ['.png', '.jpeg', '.jpg'];
            for (const file of files.image) {
                const ext = extname(file.originalname);
                if (!allowedImageTypes.includes(ext)) {
                    throw new HttpException('Invalid image file type.', HttpStatus.BAD_REQUEST);
                }
            }
        }

        

        const maxFileSize = 4 * 1024 * 1024;
        for (const file of [...(files.image || [])]) {
            if (file.size > maxFileSize) {
                throw new HttpException('File size exceeds the limit.', HttpStatus.BAD_REQUEST);
            }
        }


        if (files.image) {
            const processedImages = await Promise.all(files.image.map(file => this.processSingleImage(file)));
            try {
                const propert = await this.prismaService.property.findUnique({
                    where: { id: parseInt(property_id, 10) },
                    include: { amenities: true },
                });
                if (propert) {


                    const result = await this.prismaService.property.update({
                        where: { id: parseInt(property_id, 10) },
                        data: {

                            property_name: property.property_name,
                            property_type: property.property_type,
                            sub_type: property.sub_type,
                            purpose: property.purpose,
                            property_price: property.property_price,
                            property_area: property.property_area,
                            property_city: property.property_city,
                            property_address: property.property_address,
                            property_zip: property.property_zip,
                            property_status: property.property_status,
                            property_description: property.property_description,
                            longitude: property.longitude,
                            latitude: property.latitude,
                            updated_at: new Date(),

                            amenities: {
                                update: {
                                    where: {
                                        id: propert.amenities.id, // Replace with the actual ID of amenities
                                    },
                                    data: {
                                        ameneties_name: JSON.stringify(property.amenities_name),
                                        count: property.count,
                                        other_features: JSON.stringify(property.other_features),
                                        updated_at: new Date(),
                                        // Add any other fields you want to update in amenities
                                    },
                                },
                            },
                        } as Prisma.PropertyUpdateInput,
                        select: {
                            id: true,
                            property_name: true,
                            property_type: true,
                            sub_type: true,
                            purpose: true,
                            property_price: true,
                            property_area: true,
                            property_city: true,
                            property_address: true,
                            property_zip: true,
                            property_status: true,
                            property_description: true,
                            longitude: true,
                            latitude: true,
                            amenities: true,
                            created_at: true,
                            updated_at: true,
                        },
                    });

                    await this.prismaService.porperty_data.deleteMany({
                        where: {
                            property_id: result.id,
                            "type": "image"
                        },
                    });


                    const propertyData = processedImages.map(image => ({
                        url: image.savedImagePath,
                        type: 'image',
                        property_id: result.id,
                        updated_at: new Date(),
                    }));

                    await this.prismaService.porperty_data.createMany({
                        data: propertyData,
                    });





                    const response = {
                        timestamp_ms: Date.now(),
                        action: 'Updated Property Data',
                        Property: {
                            result
                        },

                    };

                    return { success: true, message: 'Property Updated successfully', response };

                }



            }
            catch (error) {
                return {
                    console: error,
                    success: false,
                    message: 'An error occurred while updating the Property.',
                };
            }

        }
        else if (!files.image) {
            try {
                const propert = await this.prismaService.property.findUnique({
                    where: { id: parseInt(property_id, 10) },
                    include: { amenities: true },
                });
                if (propert) {


                    const result = await this.prismaService.property.update({
                        where: { id: parseInt(property_id, 10) },
                        data: {

                            property_name: property.property_name,
                            property_type: property.property_type,
                            sub_type: property.sub_type,
                            purpose: property.purpose,
                            property_price: property.property_price,
                            property_area: property.property_area,
                            property_city: property.property_city,
                            property_address: property.property_address,
                            property_status: property.property_status,
                            property_zip: property.property_zip,
                            property_description: property.property_description,
                            longitude: property.longitude,
                            latitude: property.latitude,
                            updated_at: new Date(),

                            amenities: {
                                update: {
                                    where: {
                                        id: propert.amenities.id, 
                                    },
                                    data: {
                                        ameneties_name: JSON.stringify(property.amenities_name),
                                        count: property.count,
                                        other_features: JSON.stringify(property.other_features),
                                        updated_at: new Date(),
                                    },
                                },
                            },
                        } as Prisma.PropertyUpdateInput,
                        select: {
                            id: true,
                            property_name: true,
                            property_type: true,
                            sub_type: true,
                            purpose: true,
                            property_price: true,
                            property_area: true,
                            property_city: true,
                            property_address: true,
                            property_zip: true,
                            property_description: true,
                            property_status: true,
                            longitude: true,
                            latitude: true,
                            amenities: true,
                            created_at: true,
                            updated_at: true,
                        },
                    });

                    const response = {
                        timestamp_ms: Date.now(),
                        action: 'Updated Property Data',
                        Property: {
                            result
                        },

                    };

                    return { success: true, message: 'Property Updated successfully', response };


                }

            }
            catch (error) {

                return { success: true, message: 'Property Not Updated successfully', error: error.message };
            }


        }
    }


    async findAll(
        page = 1,
        pageSize = 50,
        filters?: { purpose?: string; property_type?: string; sub_type?: string; property_city?: string }
    ) {
        const skip = (page - 1) * pageSize;

        const where: any = {};

        if (filters) {
            if (filters.purpose) {
                where.purpose = filters.purpose;
            }

            if (filters.property_type) {
                where.property_type = filters.property_type;
            }

            if (filters.sub_type) {
                where.sub_type = filters.sub_type;
            }

            if (filters.property_city) {
                where.property_city = filters.property_city;
            }
        }

        const properties = await this.prismaService.property.findMany({
            skip,
            take: pageSize,
            include: {
                amenities: true,
                Property_data: true,

            },
            where,

        });


        const totalCount = await this.prismaService.property.count({ where });

        return {
            properties,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / pageSize),
        };
    }

    async findById(propertyId: string) {
        try {
            const property = await this.prismaService.property.findUnique({
                where: { id: parseInt(propertyId, 10) },
                include: {
                    amenities: true,
                    Property_data: true
                },
            });

            if (!property) {
                throw new NotFoundException('Property not found');
            }

            return { success: true, property };
        } catch (error) {
            console.error(error);

            return {
                success: false,
                message: 'An error occurred while fetching the property.',
            };
        }
    }

}
