/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyService } from 'src/Property/property.service';
import { PropertyModule } from 'src/Property/property.module';
import { response } from 'express';
import { CreateAmenityDto } from './dto/create.amenities.dto';
import { Prisma } from '@prisma/client';
import { PropertyTypeDto } from './dto/create.property.type.dto';
import { PropertySubTypeDto } from './dto/create.property-subType.dto';

@Injectable()
export class AdminService {
  private readonly propertyService: PropertyService;

  constructor(private readonly prismaService: PrismaService) {}
  async createPropertySubType(
    user_id: string,
    files: { image?: Express.Multer.File[] },
    createPropertySubType: PropertySubTypeDto,
  ) {
    try {
      const { subTypeName, propertyTypeId } = createPropertySubType;
      const findTypeId = await this.prismaService.propertyType.findUnique({
        where: {
          id: propertyTypeId,
        },
      });
      if (!findTypeId) {
        return {
          status: 400,
          message: 'Property Type not found',
          data: findTypeId,
        };
      }
      const propertySubType = await this.prismaService.propertySubType.create({
        data: {
          subTypeName,
          url: 'https://example.com/pool',
          propertyType: {
            connect: {
              id: propertyTypeId,
            },
          },
        } as Prisma.PropertySubTypeCreateInput,
      });
      return {
        status: 200,
        message: 'Property Sub Type created successfully',
        data: propertySubType,
      };
    } catch (error) {
      return {
        status: 400,
        message: 'Something went wrong',
        data: error,
      };
    }
  }
  async getAllPropertyType() {
    try {
      const propertyTypes = await this.prismaService.propertyType.findMany({
        select: {
          id: true,
          typeName: true,
          url: true,
          createdAt: true,
          updatedAt: true,
          subTypes: {
            select: {
              id: true,
              subTypeName: true,
              url: true,
              imageKey: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
      const transformedPropertyTypes = propertyTypes.map((property) => ({
        ...property,
        subTypes: property.subTypes.map(({ subTypeName, ...rest }) => ({
          ...rest,
          typeName: subTypeName, // replace subTypeName with typeName
        })),
      }));

      return {
        status: 200,
        message: 'Property Type fetched successfully',
        data: transformedPropertyTypes,
      };
    } catch (error) {
      return {
        status: 400,
        message: 'Something went wrong',
        data: error,
      };
    }
  }
  async createPropertyType(
    user_id: string,
    files: { image?: Express.Multer.File[] },
    createPropertyType: PropertyTypeDto,
  ) {
    try {
      const { typeName } = createPropertyType;
      const propertyType = await this.prismaService.propertyType.create({
        data: {
          typeName,
          url: 'https://example.com/pool',
        } as Prisma.PropertyTypeCreateInput,
      });
      return {
        status: 200,
        message: 'Property Type created successfully',
        data: propertyType,
      };
    } catch (error) {
      return {
        status: 400,
        message: 'Something went wrong',
        data: error,
      };
    }
  }

  async getAllAmenities() {
    try {
      const amenities = await this.prismaService.ameneties.findMany({
        select: {
          id: true,
          amenetiesName: true,
          otherFeatures: true,
          createdAt: true,
          updatedAt: true,
          // propertyId: false, // This line is not necessary as we omit it in select
        },
      });

      return {
        status: 200,
        message: 'Amenities fetched successfully',
        data: amenities,
      };
    } catch (error) {
      return {
        status: 400,
        message: 'Something went wrong',
        data: error,
      };
    }
  }
  async createAmenities(
    user_id: string,
    files: { image?: Express.Multer.File[] },
    createAmenity: CreateAmenityDto,
  ) {
    try {
      const { amenitiesName, otherFeatures } = createAmenity;
      const ameneties = await this.prismaService.ameneties.create({
        data: {
          amenetiesName: amenitiesName,
          otherFeatures,
          url: 'https://example.com/pool',
        } as Prisma.AmenetiesCreateInput,
      });
      return {
        status: 200,
        message: 'Amenity created successfully',
        data: ameneties,
      };
    } catch (error) {
      return {
        status: 400,
        message: 'Something went wrong',
        data: error,
      };
    }
  }
}
