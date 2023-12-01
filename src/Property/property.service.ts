/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';

@Injectable()
export class PropertyService {
    constructor(private readonly prismaService: PrismaService) {
    
    }
async createProperty(propertyDTO :CreatePropertyDto) {
    return await this.prismaService.property.create({
        propertyDTO,
    });


    
}

}