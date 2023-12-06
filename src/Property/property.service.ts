/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { extname, resolve } from 'path';
import * as path from 'path';
import * as  Sharp from 'sharp';
import { readFile } from 'fs/promises';
import { promises as fsPromises } from 'fs';
import { CreatePropertyDto } from './dto/create-property.dto';
import { updatedPropertyDto } from './dto/update-property.dto';
import { PropertyDataDTO } from './dto/create-propertyData.dto';

@Injectable()
export class PropertyService {
    constructor(private readonly prismaService: PrismaService) { }

    private async saveImageToDisk(buffer: Buffer, filename: string): Promise<string> {
        const destinationFolder = 'src/upload';
        const filePath = path.join(destinationFolder, filename);
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
    async createProperty(files: { image?: Express.Multer.File[]; video?: Express.Multer.File[]; }, createProperty: CreatePropertyDto) {


        if (files.image) {
            const allowedImageTypes = ['.png', '.jpeg', '.jpg'];
            for (const file of files.image) {
                const ext = extname(file.originalname);
                if (!allowedImageTypes.includes(ext)) {
                    throw new HttpException('Invalid image file type.', HttpStatus.BAD_REQUEST);
                }
            }
        }

        if (files.video) {
            const allowedVideoTypes = ['.mp4', '.avi', '.mkv'];
            for (const file of files.video) {
                const ext = extname(file.originalname);
                if (!allowedVideoTypes.includes(ext)) {
                    throw new HttpException('Invalid video file type.', HttpStatus.BAD_REQUEST);
                }
            }
        }

        const maxFileSize = 4 * 1024 * 1024;
        for (const file of [...(files.image || []), ...(files.video || [])]) {
            if (file.size > maxFileSize) {
                throw new HttpException('File size exceeds the limit.', HttpStatus.BAD_REQUEST);
            }
        }

        const property = { ...createProperty }
        let processedImages: any = [];
        if (property.user_id) {
            property.user_id = parseInt(property.user_id);
        }
        const result = await this.prismaService.property.create({
            data: property,
        });

        try {
            // if(files.video && files.image){



            // }
            // else
             if (files.image && files.video) {
                processedImages = await Promise.all(files.image.map(file => this.processSingleImage(file)));
               

                const propertyData = processedImages.map(image => ({
                    url: JSON.stringify(image.savedImagePath),
                    type: 'image',
                    property_id: result.id,
                }));

                const createdPropertyData = await this.prismaService.porperty_data.createMany({
                    data: propertyData,
                });

                return {
                    success: true,
                    message: 'Property created successfully.',
                    data: result,
                };


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
            else{
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


    async updateProperty(property_id: string, files: { image?: Express.Multer.File[]; video?: Express.Multer.File[]; }, updateProperty: updatedPropertyDto) {

        if (files.image) {
            const allowedImageTypes = ['.png', '.jpeg', '.jpg'];
            for (const file of files.image) {
                const ext = extname(file.originalname);
                if (!allowedImageTypes.includes(ext)) {
                    throw new HttpException('Invalid image file type.', HttpStatus.BAD_REQUEST);
                }
            }
        }

        if (files.video) {
            const allowedVideoTypes = ['.mp4', '.avi', '.mkv'];
            for (const file of files.video) {
                const ext = extname(file.originalname);
                if (!allowedVideoTypes.includes(ext)) {
                    throw new HttpException('Invalid video file type.', HttpStatus.BAD_REQUEST);
                }
            }
        }

        const maxFileSize = 4 * 1024 * 1024;
        for (const file of [...(files.image || []), ...(files.video || [])]) {
            if (file.size > maxFileSize) {
                throw new HttpException('File size exceeds the limit.', HttpStatus.BAD_REQUEST);
            }
        }


        if (files.image) {
            const processedImages = await Promise.all(files.image.map(file => this.processSingleImage(file)));
            try {
                let updatedPropertyDto: any = { ...updateProperty };
                updatedPropertyDto = { ...updateProperty, property_Image: JSON.stringify(processedImages.map(image => image.savedImagePath)) }
                updatedPropertyDto = { ...updateProperty, updated_at: new Date() }
                return await this.prismaService.property.update({
                    where: { id: property_id },
                    data: updatedPropertyDto,
                });
            }
            catch (error) {
                return {
                    success: false,
                    message: 'An error occurred while updating the Property.',
                };
            }

        }
    }


    async findAll(page = 1, pageSize = 50) {
        const skip = (page - 1) * pageSize;
    
        const properties = await this.prismaService.property.findMany({
          skip,
          take: pageSize,
        });
    
        const totalCount = await this.prismaService.property.count();
    
        return {
          properties,
          totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / pageSize),
        };
      }


}
