/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { PropertyService } from "./property.service";


@Controller('property')
@ApiTags('property')
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) {}


    @Post()
    @ApiTags('property')
    async createProperty(@Body() propertyDTO: CreatePropertyDto) {
        return await this.propertyService.createProperty(propertyDTO);
    }




}
