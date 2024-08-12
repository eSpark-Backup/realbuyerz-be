/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateUserPropertyDto } from './dto/create-property.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { updateUserPropertyDto } from './dto/update-property.dto';

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

    try {
      let result = null;
      let amenitiesArray: string[] = [];
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

  async updateProperty(updateProperty: updateUserPropertyDto, id: string) {
    const property = { ...updateProperty };

    if (property.propertyPrice) {
      property.propertyPrice = parseInt(property.propertyPrice);
    }

    if (property.propertyStatus) {
      property.propertyStatus = Boolean(property.propertyStatus);
    }

    try {
      const findProperty = await this.prismaService.property.findUnique({
        where: { id: id },
        include: { amenities: true, propertyType: true },
      });

      if (!findProperty) {
        return {
          success: false,
          message: 'Failed to update property.',
          error: 'Property not found.',
        };
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

      //disconnect the subType from property
      await this.prismaService.propertyAmenity.deleteMany({
        where: {
          propertyId: id,
          amenityId: {
            in: findProperty.amenities.map((amenity) => amenity.amenityId),
          },
        },
      });

      //disconnect the subType from property
      if (property.propertySubTypeId) {
        await this.prismaService.property.update({
          where: { id: id },
          data: {
            propertyType: {
              disconnect: { id: findProperty.propertyTypeId },
            },
          },
        });
        findProperty.propertyTypeId = property.propertySubTypeId;
      }

      const result = await this.prismaService.property.update({
        where: { id: id },
        data: {
          propertyName: property.propertyName,
          propertyType: {
            connect: { id: findProperty.propertyTypeId },
          },
          purpose: property.purpose,
          propertyPrice: property.propertyPrice,
          propertyArea: property.property_area,
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
    try {
      const findProperty = await this.prismaService.property.findUnique({
        where: { id: id },
      });
      if (!findProperty) {
        return {
          success: false,
          message: 'Failed to delete property.',
          error: 'Property not found.',
        };
      }
      const result = await this.prismaService.property.delete({
        where: { id: id },
      });

      if (result) {
        const propertyResponse = {
          action: 'delete',
          success: true,
          message: 'Property deleted successfully',
          data: result,
        };
        return propertyResponse;
      } else {
        return {
          success: false,
          message: 'Failed to delete property.',
          error: 'Property deletion failed.',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete property.',
        error: error.message,
      };
    }
  }
}
