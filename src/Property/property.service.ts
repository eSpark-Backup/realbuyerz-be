/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { extname, resolve } from 'path';
import * as path from 'path';
import * as Sharp from 'sharp';
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
  constructor(
    private readonly prismaService: PrismaService,
    private readonly backblazeService: BackblazeService,
  ) {}
  private async processSingleImage(file: Express.Multer.File): Promise<any> {
    const watermarkPath = 'src/utils/watermark/Quote.png';

    const buffer = await Sharp(file.buffer)
      .resize({ width: 600, height: 500, fit: 'cover' })
      .composite([
        { input: await readFile(resolve(watermarkPath)), gravity: 'center' },
      ])
      .png()
      .toBuffer();

    const uploadResult = await this.backblazeService.uploadFileFromBuffer(
      buffer,
      file.originalname,
    );
    // const savedImagePath = await saveImageToDisk(buffer, file.originalname);

    return {
      ...file,
      uploadResult,
    };
  }
  async deleteProperty(propertyId: string, userId: string) {
    try {
      const findProperty = await this.prismaService.property.findUnique({
        where: { id: propertyId },
        select: { userId: true },
      });
      if (!findProperty) {
        return {
          action: 'Delete Property',
          message: 'Property not found',
        };
      }
      if (findProperty.userId !== userId) {
        return {
          action: 'Delete Property',
          message: 'You are not authorized to delete this property',
        };
      }
      await this.prismaService.porperty_data.deleteMany({
        where: {
          propertyId: propertyId,
        },
      });
      await this.prismaService.propertyAmenity.deleteMany({
        where: {
          propertyId: propertyId,
        },
      });
      await this.prismaService.bidding.deleteMany({
        where: {
          agentPropertyId: propertyId,
        },
      });

      await this.prismaService.property.update({
        where: { id: propertyId },
        data: {
          propertyType: { disconnect: true },
        },
      });
      await this.prismaService.property.delete({
        where: {
          id: propertyId,
        },
      });

      return {
        status: true,
        action: 'Delete Property',
        message: 'Property Deleted Successfully',
      };
    } catch (error) {
      return {
        action: 'Delete Property',
        message: 'Failed to delete property',
        error: error.message,
      };
    }
  }

  async findbyuserId(
    user_id: string,
    page = 1,
    pageSize = 50,
    filters?: {
      purpose?: string;
      propertyType?: string;
      subType?: string;
      propertyCity?: string;
      propertyBy?: string;
      propertyId?: string;
      proposals?: boolean;
    },
  ) {
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (filters) {
      if (filters.purpose) {
        where.purpose = filters.purpose;
      }

      if (filters.propertyCity) {
        where.propertyCity = filters.propertyCity;
      }

      if (filters.propertyId) {
        where.id = filters.propertyId;
      }

      if (filters.propertyType) {
        where.propertyType = {
          propertyType: {
            typeName: filters.propertyType,
          },
        };
      }

      if (filters.subType) {
        where.propertyType = {
          ...where.propertyType,
          subTypeName: filters.subType,
        };
      }
    }

    where.userId = user_id;
    const agentPropertyIds = await this.prismaService.bidding.findMany({
      select: {
        agentPropertyId: true,
      },
    });

    const AgentBiddingPropertyIds = agentPropertyIds.map(
      (bid) => bid.agentPropertyId,
    );

    if (String(filters.proposals) == 'true') {
      //from string to bool

      const whereCondition = {
        AND: [
          where,
          {
            id: {
              in: AgentBiddingPropertyIds,
            },
          },
        ],
      };
      const [properties, totalCount] = await Promise.all([
        this.prismaService.property.findMany({
          skip,
          take: pageSize,
          include: {
            amenities: {
              select: {
                amenity: true,
              },
            },
            PropertyData: true,
            propertyType: {
              select: {
                id: true,
                subTypeName: true,
                url: true,
                imageKey: true,
                propertyType: {
                  select: {
                    id: true,
                    typeName: true,
                    url: true,
                    imageKey: true,
                  },
                },
              },
            },
          },
          where: whereCondition,
        }),
        this.prismaService.property.count({
          where: whereCondition,
        }),
      ]);

      const items = properties.map((property) => ({
        ...property,
        amenities: property.amenities.map((amenity) => amenity.amenity),
      }));

      const data = {
        items,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
        itemsPerPage: pageSize,
      };
      return {
        action: 'Get All',
        message: 'All Properties of User',
        data: data,
      };
    }

    const whereCondition = {
      AND: [
        where,
        {
          id: {
            notIn: AgentBiddingPropertyIds,
          },
        },
      ],
    };
    const [properties, totalCount] = await Promise.all([
      this.prismaService.property.findMany({
        skip,
        take: pageSize,
        include: {
          amenities: {
            select: {
              amenity: true,
            },
          },
          PropertyData: true,
          propertyType: {
            select: {
              id: true,
              subTypeName: true,
              url: true,
              imageKey: true,
              propertyType: {
                select: {
                  id: true,
                  typeName: true,
                  url: true,
                  imageKey: true,
                },
              },
            },
          },
        },
        where: whereCondition,
      }),
      this.prismaService.property.count({
        where: whereCondition,
      }),
    ]);

    const items = properties.map((property) => ({
      ...property,
      amenities: property.amenities.map((amenity) => amenity.amenity),
    }));

    const data = {
      items,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
      itemsPerPage: pageSize,
    };
    return {
      action: 'Get All',
      message: 'All Properties of User',
      data: data,
    };
  }
  catch(error) {
    console.error('Error finding properties by user ID:', error.message);
    return {
      message: 'Failed to find properties by user ID',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
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
      return {
        message: 'Failed to Create Property',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      };
    }
  }
  async createProperty(
    user_id: string,
    files: { image?: Express.Multer.File[] },
    createProperty: CreatePropertyDto,
  ) {
    createProperty.userId = user_id;
    if (files.image) {
      const allowedImageTypes = ['.png', '.jpeg', '.jpg'];
      for (const file of files.image) {
        const ext = extname(file.originalname);
        if (!allowedImageTypes.includes(ext)) {
          throw new HttpException(
            'Invalid image file type.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }

    const maxFileSize = 4 * 1024 * 1024;
    for (const file of [...(files.image || [])]) {
      if (file.size > maxFileSize) {
        throw new HttpException(
          'File size exceeds the limit.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const property = { ...createProperty };
    property.propertyBy = 'agent';
    let processedImages: any = [];

    if (property.propertyPrice) {
      property.propertyPrice = parseInt(property.propertyPrice);
    }
    console.log(property.amenities);
    let result = null;
    let amenitiesArray: string[] = [];

    // Check if `property.amenities` is a string or an array
    if (typeof property.amenities === 'string') {
      amenitiesArray = property.amenities
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
    } else if (Array.isArray(property.amenities)) {
      amenitiesArray = property.amenities
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
    }
    const amenities = await this.prismaService.ameneties.findMany({
      where: {
        id: {
          in: amenitiesArray,
        },
      },
    });
    if (amenities.length !== amenitiesArray.length) {
      return {
        success: false,
        message: 'Failed to Create property.',
        action: 'Create Property',
        error: 'Amenities not found.',
      };
    }

    if (property.propertySubTypeId) {
      const propertySubType =
        await this.prismaService.propertySubType.findUnique({
          where: { id: property.propertySubTypeId },
        });
      if (!propertySubType) {
        return {
          success: false,
          message: 'Failed to Create property.',
          error: 'Property Sub Type not found.',
          action: 'Create Property',
        };
      }
    }

    try {
      const propertyData: Prisma.PropertyCreateInput = {
        user: { connect: { id: user_id } },
        propertyName: property.propertyName,
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
        propertyType: {
          connect: { id: property.propertySubTypeId },
        },
        amenities: {
          create: amenitiesArray.map((id) => ({
            amenity: { connect: { id } },
          })),
        },
      };

      result = await this.prismaService.property.create({
        data: propertyData,
      });
    } catch (error) {
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
        processedImages = await Promise.all(
          files.image.map((file) => this.processSingleImage(file)),
        );

        let propertyData = processedImages.map((image) => ({
          url: `${image.uploadResult.url}`,
          type: 'image',
          imageKey: image.uploadResult.fileId,
          propertyId: result.id,
        }));

        if (createProperty.video) {
          const videoData = this.formatVideoData(
            createProperty.video,
            result.id,
          );
          propertyData = [...propertyData, ...videoData];
        }
        await this.prismaService.porperty_data.createMany({
          data: propertyData,
        });

        const propertyResponse = {
          success: true,
          action: 'Create Property',
          message: 'PropertyCreated Successfully',
          data: result,
        };
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
        await this.prismaService.property.delete({
          where: { id: result.id },
        });

        return {
          success: false,
          message: 'No images/Videos provided for property creation.',
        };
      }
    } catch (error) {
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

  async updateProperty(
    property_id: string,
    files: { image?: Express.Multer.File[] },
    updateProperty: updatedPropertyDto,
  ) {
    const property = { ...updateProperty };

    if (property.propertyPrice) {
      property.propertyPrice = parseInt(property.propertyPrice);
    }

    if (property.propertyStatus) {
      property.propertyStatus = Boolean(property.propertyStatus);
    }
    if (files.image) {
      const allowedImageTypes = ['.png', '.jpeg', '.jpg'];
      for (const file of files.image) {
        const ext = extname(file.originalname);
        if (!allowedImageTypes.includes(ext)) {
          throw new HttpException(
            'Invalid image file type.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }

    const maxFileSize = 4 * 1024 * 1024;
    for (const file of [...(files.image || [])]) {
      if (file.size > maxFileSize) {
        throw new HttpException(
          'File size exceeds the limit.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    let amenitiesArray: string[] = [];

    // Check if `property.amenities` is a string or an array
    if (typeof property.amenities === 'string') {
      amenitiesArray = property.amenities
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
    } else if (Array.isArray(property.amenities)) {
      amenitiesArray = property.amenities
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
    }
    //findameneities with amenitie array
    const amenities = await this.prismaService.ameneties.findMany({
      where: {
        id: {
          in: amenitiesArray,
        },
      },
    });
    if (amenities.length !== amenitiesArray.length) {
      return {
        success: false,
        message: 'Failed to update property.',
        error: 'Amenities not found.',
      };
    }

    if (property.propertySubTypeId) {
      const propertySubType =
        await this.prismaService.propertySubType.findUnique({
          where: { id: property.propertySubTypeId },
        });
      if (!propertySubType) {
        return {
          success: false,
          message: 'Failed to update property.',
          error: 'Property Sub Type not found.',
        };
      }
    }

    if (files.image) {
      const processedImages = await Promise.all(
        files.image.map((file) => this.processSingleImage(file)),
      );
      try {
        const propert = await this.prismaService.property.findUnique({
          where: { id: property_id },
          include: { amenities: true, propertyType: true },
        });

        if (propert) {
          //delete all amenties from propert
          await this.prismaService.propertyAmenity.deleteMany({
            where: {
              propertyId: property_id,
              amenityId: {
                in: propert.amenities.map((amenity) => amenity.amenityId),
              },
            },
          });

          //disconnect the subType from property
          if (property.propertySubTypeId) {
            await this.prismaService.property.update({
              where: { id: property_id },
              data: {
                propertyType: {
                  disconnect: { id: propert.propertyType.id },
                },
              },
            });
            propert.propertyTypeId = property.propertySubTypeId;
          }

          const result = await this.prismaService.property.update({
            where: { id: property_id },
            data: {
              propertyName: property.propertyName,
              propertyType: {
                connect: { id: propert.propertyTypeId },
              },
              purpose: property.purpose,
              propertyPrice: property.propertyPrice,
              propertyArea: property.propertyArea,
              propertyCity: property.propertyCity,
              propertyAddress: property.propertyAddress,
              propertyZip: property.propertyAddress,
              propertyStatus: property.propertyStatus,
              propertyDescription: property.propertyDescription,
              amenities: {
                create: amenitiesArray.map((id) => ({
                  amenity: { connect: { id } },
                })),
              },
              longitude: property.longitude,
              latitude: property.latitude,
            } as Prisma.PropertyUpdateInput,
            select: {
              id: true,
              propertyName: true,
              propertyType: true,
              purpose: true,
              propertyPrice: true,
              propertyArea: true,
              propertyCity: true,
              propertyAddress: true,
              propertyZip: true,
              propertyStatus: true,
              PropertyData: true,
              propertyDescription: true,
              longitude: true,
              latitude: true,
              amenities: true,
            },
          });

          try {
            await this.deleteImagesForProperty(property_id);
            await this.deleteVideosForProperty(property_id);
          } catch (error) {
            return {
              success: false,
              message: 'Failed to delete images/Videos for property',
              error: error.message,
            };
          }

          let propertyData = processedImages.map((image) => ({
            url: `${image.uploadResult.url}`,
            type: 'image',
            imageKey: image.uploadResult.fileId,
            propertyId: result.id,
          }));
          if (updateProperty.video) {
            const videoData = this.formatVideoData(
              updateProperty.video,
              result.id,
            );
            propertyData = [...propertyData, ...videoData];
          }

          await this.prismaService.porperty_data.createMany({
            data: propertyData,
          });

          const propertyResponse = {
            action: 'Update Property',
            message: 'Property Updated successfully',
            data: result,
          };

          return propertyResponse;
        }
      } catch (error) {
        return {
          console: error,
          success: false,
          message: 'An error occurred while updating the Property.',
        };
      }
    } else if (!files.image) {
      try {
        const propert = await this.prismaService.property.findUnique({
          where: { id: property_id },
          include: { amenities: true },
        });
        if (propert) {
          //disconnect the subType from property
          await this.prismaService.propertyAmenity.deleteMany({
            where: {
              propertyId: property_id,
              amenityId: {
                in: propert.amenities.map((amenity) => amenity.amenityId),
              },
            },
          });

          //disconnect the subType from property
          if (property.propertySubTypeId) {
            await this.prismaService.property.update({
              where: { id: property_id },
              data: {
                propertyType: {
                  disconnect: { id: propert.propertyTypeId },
                },
              },
            });
            propert.propertyTypeId = property.propertySubTypeId;
          }

          const result = await this.prismaService.property.update({
            where: { id: property_id },
            data: {
              propertyName: property.propertyName,
              propertyType: {
                connect: { id: propert.propertyTypeId },
              },
              purpose: property.purpose,
              propertyPrice: property.propertyPrice,
              propertyArea: property.propertyArea,
              propertyCity: property.propertyCity,
              propertyAddress: property.propertyAddress,
              propertyZip: property.propertyAddress,
              propertyStatus: property.propertyStatus,
              propertyDescription: property.propertyDescription,
              amenities: {
                create: amenitiesArray.map((id) => ({
                  amenity: { connect: { id } },
                })),
              },
              longitude: property.longitude,
              latitude: property.latitude,
            } as Prisma.PropertyUpdateInput,
            select: {
              id: true,
              propertyName: true,
              propertyType: true,
              purpose: true,
              propertyPrice: true,
              propertyArea: true,
              propertyCity: true,
              propertyAddress: true,
              propertyZip: true,
              propertyStatus: true,
              propertyDescription: true,
              PropertyData: true,
              longitude: true,
              latitude: true,
              amenities: true,
            },
          });

          const propertyResponse = {
            action: 'Update Property Data',
            message: 'Property Updated Successfully',
            data: result,
          };

          return propertyResponse;
        }
      } catch (error) {
        return {
          success: true,
          message: 'Property Not Updated successfully',
          error: error.message,
        };
      }
    }
  }

  formatVideoData(
    video: string[],
    id: string,
  ): { imageKey: string; url: string; type: string; propertyId: string }[] {
    const videoUrls = String(video)
      .split(',')
      .map((url) => url.trim());

    const videoData = videoUrls.map((url) => ({
      url: url,
      type: 'video',
      propertyId: id,
      imageKey: 'NA',
    }));

    return videoData;
  }

  async deleteImagesForProperty(propertyId: string) {
    try {
      const images = await this.prismaService.porperty_data.findMany({
        where: {
          propertyId: propertyId,
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

  async deleteVideosForProperty(propertyId: string) {
    try {
      await this.prismaService.porperty_data.deleteMany({
        where: {
          propertyId: propertyId,
          type: 'video',
        },
      });
    } catch (error) {
      console.error('Error deleting videos:', error);
      throw new Error('Failed to delete videos');
    }
  }

  async findAll(
    page = 1,
    pageSize = 50,
    filters?: {
      purpose?: string;
      propertyType?: string;
      subType?: string;
      propertyCity?: string;
      propertyBy?: string;
      propertyId?: string;
    },
  ) {
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (filters) {
      if (filters.purpose) {
        where.purpose = filters.purpose;
      }

      if (filters.propertyCity) {
        where.propertyCity = filters.propertyCity;
      }

      if (filters.propertyId) {
        where.id = filters.propertyId;
      }

      if (filters.propertyType) {
        where.propertyType = {
          propertyType: {
            typeName: filters.propertyType,
          },
        };
      }

      if (filters.subType) {
        where.propertyType = {
          ...where.propertyType,
          subTypeName: filters.subType,
        };
      }
    }
    where.propertyBy = 'user';

    const properties = await this.prismaService.property.findMany({
      skip,
      take: pageSize,
      include: {
        amenities: {
          select: {
            amenity: true, // Include only the name
          },
        },
        propertyType: {
          include: {
            propertyType: true, // Include the related PropertyType
          },
        },
      },
      where,
    });

    const items = properties.map((property) => ({
      ...property,
      amenities: property.amenities.map((amenity) => amenity.amenity),
    }));

    const totalCount = await this.prismaService.property.count({ where });

    const data = {
      items,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
      itemsPerPage: pageSize,
    };

    return {
      action: 'Find All Properties',
      message: 'Properties Found',
      data,
    };
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

      return { message: 'Property Fetched', success: true, property };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: 'An error occurred while fetching the property.',
      };
    }
  }
}
