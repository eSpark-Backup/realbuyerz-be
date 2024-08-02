/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateUserPropertyDto } from './dto/create-property.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserPropertyService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProperty(user_id: string, createProperty: CreateUserPropertyDto) {
    const property = { ...createProperty };
    property.userId = user_id;
    property.propertyBy = 'user';

    if (property.propertyPrice) {
      property.propertyPrice = parseInt(property.propertyPrice);
    }
    if (property.count) {
      property.count = parseInt(property.count);
    }

    try {
      // const result = await this.prismaService.property.create({
      //   data: {
      //     user: { connect: { id: property.userId } },
      //     propertyName: property.propertyName,
      //     propertyType: property.propertyType,
      //     subType: property.subType,
      //     purpose: property.purpose,
      //     propertyPrice: property.propertyPrice,
      //     propertyArea: property.propertyArea,
      //     propertyCity: property.propertyCity,
      //     propertyBy: property.propertyBy,
      //     propertyAddress: property.propertyAddress,
      //     propertyZip: property.propertyZip,
      //     propertyDescription: property.propertyDescription,
      //     longitude: property.longitude,
      //     latitude: property.latitude,

      //     amenities: {
      //       create: {
      //         amenetiesName: JSON.stringify(property.amenitiesName),
      //         count: property.count,
      //         otherFeatures: JSON.stringify(property.otherFeatures),
      //       },
      //     },
      //   } as Prisma.PropertyCreateInput,
      // });

      const result = 0;
      if (result) {
        const propertyResponse = {
          action: 'create',
          success: true,
          message: 'Property created successfully for User',
          data: result,
        };

        return propertyResponse;
      } else {
        return {
          success: false,
          message: 'Failed to create property.',
          error: 'Property creation failed.',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create property.',
        error: error.message,
      };
    }
  }

  async updateProperty(updateProperty: any, id: string) {
    const property = { ...updateProperty };

    if (property.propertyPrice) {
      property.propertyPrice = parseInt(property.propertyPrice);
    }
    if (property.count) {
      property.count = parseInt(property.count);
    }
    if (property.propertyStatus) {
      property.propertyStatus = Boolean(property.propertyStatus);
    }

    try {
      const findProperty = await this.prismaService.property.findUnique({
        where: { id: id },
        include: { amenities: true },
      });

      if (!findProperty) {
        return {
          success: false,
          message: 'Failed to update property.',
          error: 'Property not found.',
        };
      }

      // const result = await this.prismaService.property.update({
      //   where: { id: id },
      //   data: {
      //     propertyName: property.propertyName,
      //     propertyType: property.propertyType,
      //     subType: property.subType,
      //     purpose: property.purpose,
      //     propertyPrice: property.propertyPrice,
      //     propertyArea: property.propertyArea,
      //     propertyCity: property.propertyCity,
      //     propertyAddress: property.propertyAddress,
      //     propertyZip: property.propertyZip,
      //     propertyDescription: property.propertyDescription,
      //     longitude: property.longitude,
      //     latitude: property.latitude,
      //     propertyStatus: property.propertyStatus,
      //   } as Prisma.PropertyUpdateInput,
      //   select: {
      //     id: true,
      //     propertyName: true,
      //     propertyType: true,
      //     purpose: true,
      //     propertyPrice: true,
      //     propertyArea: true,
      //     propertyCity: true,
      //     propertyAddress: true,
      //     propertyZip: true,
      //     propertyDescription: true,
      //     longitude: true,
      //     latitude: true,
      //     propertyStatus: true,
      //     amenities: {
      //       select: {
      //         amenetiesName: true,
      //         count: true,
      //         otherFeatures: true,
      //       },
      //     },
      //   },
      // });
      const result = 0;

      if (result) {
        const propertyResponse = {
          action: 'update',
          success: true,
          message: 'Property updated successfully',
          data: result,
        };

        return propertyResponse;
      } else {
        return {
          success: false,
          message: 'Failed to update property.',
          error: 'Property update failed.',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update property.',
        error: error.message,
      };
    }
  }

  async deleteProperty(id: string) {
    //   try {
    //     const findProperty = await this.prismaService.property.findUnique({
    //       where: { id: id },
    //     });
    //     if (!findProperty) {
    //       return {
    //         success: false,
    //         message: 'Failed to delete property.',
    //         error: 'Property not found.',
    //       };
    //     }
    //     const deleteAmeneties = await new Promise((resolve, reject) => {
    //       this.prismaService.ameneties
    //         .deleteMany({
    //           where: { properties: { : id } },
    //         })
    //         .then((result) => {
    //           resolve(result);
    //         })
    //         .catch((error) => {
    //           reject(error);
    //         });
    //     });
    //     if (!deleteAmeneties) {
    //       return {
    //         success: false,
    //         message: 'Failed to delete property.',
    //         error: 'Property deletion failed.',
    //       };
    //     }
    //     const result = await this.prismaService.property.delete({
    //       where: { id: id },
    //     });
    //     if (result) {
    //       const propertyResponse = {
    //         action: 'delete',
    //         success: true,
    //         message: 'Property deleted successfully',
    //         data: result,
    //       };
    //       return propertyResponse;
    //     } else {
    //       return {
    //         success: false,
    //         message: 'Failed to delete property.',
    //         error: 'Property deletion failed.',
    //       };
    //     }
    //   } catch (error) {
    //     return {
    //       success: false,
    //       message: 'Failed to delete property.',
    //       error: error.message,
    //     };
    //   }
    // }
  }
}
