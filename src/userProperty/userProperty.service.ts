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
  async findAll(
    page = 1,
    pageSize = 50,
    filters?: {
      purpose?: string;
      propertyType?: string;
      subType?: string;
      propertyCity?: string;
      propertyId?: string;
    },
  ) {
    const skip = (page - 1) * pageSize;

    const agentPropertyIds = await this.prismaService.bidding.findMany({
      select: {
        agentPropertyId: true,
      },
    });

    const excludedAgentPropertyIds = agentPropertyIds.map(
      (bid) => bid.agentPropertyId,
    );

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
    where.propertyBy = 'agent';

    const whereCondition = {
      AND: [
        where,
        {
          id: {
            notIn: excludedAgentPropertyIds,
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
            include: {
              propertyType: true,
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
      action: 'Find All Properties',
      message: 'Properties Found',
      data,
    };
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
      status?: boolean;
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
      if (filters.status) {
        if (String(filters.status) === 'true') {
          where.propertyStatus = true;
        } else {
          where.propertyStatus = false;
        }
      }

      if (filters.subType) {
        where.propertyType = {
          ...where.propertyType,
          subTypeName: filters.subType,
        };
      }
    }
    where.userId = user_id;

    const totalCount = await this.prismaService.property.count({});

    const properties = await this.prismaService.property.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        amenities: {
          select: {
            amenity: true, // Include only the name
          },
        },
        PropertyData: true,
        propertyType: true,
      },
    });
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

  async updateProperty(updateProperty: updateUserPropertyDto, id: string) {
    const property = { ...updateProperty };

    if (property.propertyPrice) {
      property.propertyPrice = parseInt(property.propertyPrice);
    }

    if (property.propertyStatus) {
      if (String(property.propertyStatus) === 'true') {
        property.propertyStatus = true;
      } else {
        property.propertyStatus = false;
      }
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

      await this.prismaService.propertyAmenity.deleteMany({
        where: {
          propertyId: propertyId,
        },
      });
      await this.prismaService.bidding.deleteMany({
        where: {
          userPropertyId: propertyId,
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
}
