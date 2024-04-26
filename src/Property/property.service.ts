/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { saveImageToDisk } from '../utils/function/saveImage';
import { generateResponse } from 'src/utils/function/response';
import { BackblazeService } from 'src/utils/function/backblaze';
import { url } from 'inspector';

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}


@Injectable()
export class PropertyService {
    constructor(private readonly prismaService: PrismaService,
        private readonly backblazeService: BackblazeService,
        ) { }
    private async processSingleImage(file: Express.Multer.File): Promise<any> {

        const watermarkPath = 'src/utils/watermark/Quote.png';

        const buffer = await Sharp(file.buffer)
            .resize({ width: 600, height: 500, fit: 'cover' })
            .composite([{ input: await readFile(resolve(watermarkPath)), gravity: 'center' }])
            .png()
            .toBuffer();

        const uploadResult = await this.backblazeService.uploadFileFromBuffer(buffer, file.originalname);
        // const savedImagePath = await saveImageToDisk(buffer, file.originalname);

        return {
            ...file,
            uploadResult,
        };
    }

    async findbyuserId(user_id: string) {
        try {


           

            const totalCount = await this.prismaService.property.count({
                where: {
                    userId: user_id,
                },
            });

            const properties = await this.prismaService.property.findMany({
                where: {
                    userId: user_id,
                },
                include: {
                    amenities: true,
                    PropertyData: true,
                }


            }

            );
            const data = {
                properties,
                totalCount,
            };
            return {
                action:'Get All',
                message:'All Properties of User',
                data:data

            }
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
    async createProperty(user_id:string, files: { image?: Express.Multer.File[] }, createProperty: CreatePropertyDto) {

        createProperty.userId = user_id;
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
        property.propertyBy = "agent";
        let processedImages: any = [];
       
        if (property.propertyPrice) {
            property.propertyPrice = parseInt(property.propertyPrice);

        }
        if (property.count) {
            property.count = parseInt(property.count);
        }

        let result = null;
        try {
            const propertyData: Prisma.PropertyCreateInput = {
                user: { connect: { id: user_id } },
                propertyName: property.propertyName,
                propertyType: property.propertyType,
                subType: property.subType,
                purpose: property.purpose,
                propertyPrice: property.propertyPrice,
                propertyArea: property.propertyArea,
                propertyCity: property.propertyCity,
                propertyAddress: property.propertyAddress,
                propertyZip: property.propertyZip,
                propertyBy: property.propertyBy,
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
            };
            result = await this.prismaService.property.create({
                data: propertyData,
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

                let propertyData = processedImages.map(image => ({
                    url:`${image.uploadResult.url}`,
                    type: 'image',
                    imageKey: image.uploadResult.fileId,
                    propertyId: result.id,
                }));

                if (createProperty.video) {
                    const videoUrls = String(createProperty.video).split(',').map(url => url.trim()); // Split the string and trim each URL
                    
                   const  videoData = videoUrls.map(url => ({
                        url: url,
                        type: 'video',
                        propertyId: result.id // Assuming result.id is the ID of the property
                    }));
                    propertyData=[...propertyData,...videoData]
                }
                await this.prismaService.porperty_data.createMany({
                    data: propertyData,
                });

                
                const propertyResponse = { success: true,action:"Create Property",message: 'PropertyCreated Successfully', data:result};
                return propertyResponse;



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
       
        if (property.propertyPrice) {
            property.propertyPrice = parseInt(property.propertyPrice);

        }
        if (property.count) {
            property.count = parseInt(property.count);
        }

        if (property.propertyStatus) {
            property.propertyStatus = Boolean(property.propertyStatus);
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
                    where: { id: property_id },
                    include: { amenities: true },
                });
                if (propert) {


                    const result = await this.prismaService.property.update({
                        where: { id: property_id },
                        data: {

                            propertyName: property.propertyName,
                            propertyType: property.propertyType,
                            subType: property.subType,
                            purpose: property.purpose,
                            propertyPrice: property.propertyPrice,
                            propertyArea: property.propertyArea,
                            propertyCity: property.propertyCity,
                            propertyAddress: property.propertyAddress,
                            propertyZip: property.propertyAddress,
                            propertyStatus: property.propertyStatus,
                            propertyDescription: property.propertyDescription,
                            longitude: property.longitude,
                            latitude: property.latitude,

                            amenities: {
                                update: {
                                    where: {
                                        id: propert.amenities.id, 
                                    },
                                    data: {
                                        amenetiesName: JSON.stringify(property.amenitiesName),
                                        count: property.count,
                                        otherFeatures: JSON.stringify(property.otherFeatures),
                                        updated_at: new Date(),
                                       
                                    },
                                },
                            },
                        } as Prisma.PropertyUpdateInput,
                        select: {
                            id: true,
                            propertyName: true,
                            propertyType: true,
                            subType: true,
                            purpose: true,
                            propertyPrice: true,
                            propertyArea: true,
                            propertyCity: true,
                            propertyAddress: true,
                            propertyZip: true,
                            propertyStatus: true,
                            propertyDescription: true,
                            longitude: true,
                            latitude: true,
                            amenities: true,
                        },
                    });

                    try {
                        await this.deleteImagesForProperty(property_id);
                      } catch (error) {
                       return { success: false, message: 'Failed to delete images for property', error: error.message };
                      }


                    const propertyData = processedImages.map(image => ({
                        url:`${image.uploadResult.url}`,
                        type: 'image',
                        imageKey: image.uploadResult.fileId,
                        propertyId: result.id,
                    }));

                    await this.prismaService.porperty_data.createMany({
                        data: propertyData,
                    });

                    const propertyResponse = {
                        action: 'Update Property',
                        message: 'Property Updated successfully',
                        data: result,
                    }


                    return propertyResponse;

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
                    where: { id: property_id },
                    include: { amenities: true },
                });
                if (propert) {


                    const result = await this.prismaService.property.update({
                        where: { id: property_id },
                        data: {

                            propertyName: property.propertyName,
                            propertyType: property.propertyType,
                            subType: property.subType,
                            purpose: property.purpose,
                            propertyPrice: property.propertyPrice,
                            propertyArea: property.propertyArea,
                            propertyCity: property.propertyCity,
                            propertyAddress: property.propertyAddress,
                            propertyStatus: property.propertyStatus,
                            propertyZip: property.propertyZip,
                            propertyDescription: property.propertyDescription,
                            longitude: property.longitude,
                            latitude: property.latitude,

                            amenities: {
                                update: {
                                    where: {
                                        id: propert.amenities.id, 
                                    },
                                    data: {
                                        ameneties_name: JSON.stringify(property.amenitiesName),
                                        count: property.count,
                                        otherFeatures: JSON.stringify(property.otherFeatures),
                                    },
                                },
                            },
                        } as Prisma.PropertyUpdateInput,
                        select: {
                            id: true,
                            propertyName: true,
                            propertyType: true,
                            subType: true,
                            purpose: true,
                            propertyPrice: true,
                            propertyArea: true,
                            propertyCity: true,
                            propertyAddress: true,
                            propertyZip: true,
                            propertyDescription: true,
                            propertyStatus: true,
                            longitude: true,
                            latitude: true,
                            amenities: true,
                        },
                    });

                    const propertyResponse =  {
                        action: 'Update Property Data',
                        message:'Property Updated Successfully',
                        data:result
                    }
                   
                    return propertyResponse;



                }

            }
            catch (error) {

                return { success: true, message: 'Property Not Updated successfully', error: error.message };
            }


        }
    }

    async deleteImagesForProperty(propertyId: string) {
        try {
         
          const images = await this.prismaService.porperty_data.findMany({
            where: {
              propertyId:propertyId,
              type: 'image',
            },
          });
          await this.prismaService.porperty_data.deleteMany({
            where: {
              propertyId: propertyId,
              type: 'image',
            },
          });
    
          for (const image of images) {
            const { url: propertyImage, imageKey } = image;

            const fileName = path.basename(new URL(propertyImage).pathname);
    
            await this.backblazeService.deleteFile(fileName, imageKey);
          }
        } catch (error) {
          console.error('Error deleting images:', error);
          throw new Error('Failed to delete images');
        }
      }


    async findAll(
        page = 1,
        pageSize = 50,
        filters?: { purpose?: string; property_type?: string; sub_type?: string; property_city?: string;property_by?:string }
    ) {
        const skip = (page - 1) * pageSize;

        const where: any = {};

        if (filters) {
            if (filters.purpose) {
                where.purpose = filters.purpose;
            }

            if (filters.property_type) {
                where.propertyType = filters.property_type;
            }

            if (filters.sub_type) {
                where.subType = filters.sub_type;
            }

            if (filters.property_city) {
                where.propertyCity = filters.property_city;
            }
            if (filters.property_by) {
                where.propertyBy = filters.property_by;
            }
        }

        const properties = await this.prismaService.property.findMany({
            skip,
            take: pageSize,
            include: {
                amenities: true,
                PropertyData: true,

            },
            where,

        });


        const totalCount = await this.prismaService.property.count({ where });

        const data = {
            properties,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / pageSize),
            itemsPerPage:pageSize
        };

        return {
            action: 'Find All Properties',
            message: 'Properties Found',
            data,
        }
    }

    async findById(propertyId: string) {
        try {
            const property = await this.prismaService.property.findUnique({
                where: { id: propertyId },
                include: {
                    amenities: true,
                    PropertyData: true,
                 
                },
            });

            if (!property) {
                throw new NotFoundException('Property not found');
            }

            return {message:'Property Fetched', success: true, property };
        } catch (error) {
            console.error(error);

            return {
                success: false,
                message: 'An error occurred while fetching the property.',
            };
        }
    }

}

