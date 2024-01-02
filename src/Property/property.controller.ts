/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { PropertyService } from "./property.service";
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from "path";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { updatedPropertyDto } from "./dto/update-property.dto";
import { PropertyQueryDto } from "./dto/property_quey-dto";
import { propertyImageFileInterceptor } from "src/utils/propertyfile.interceptor";
import { CreateApiDocs, FindAllApiDocs, UpdateApiDocs } from "src/utils/property.decorator";

@Controller('property')
@ApiBearerAuth()
@ApiTags('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) { }
  @Post()
  @ApiTags('property')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(propertyImageFileInterceptor)
  @CreateApiDocs()
  async createProperty(
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
    @Body() createProperty: CreatePropertyDto,
  ) {
    const result = await this.propertyService.createProperty(files, createProperty);
    return result;
  }



  @Put('/:id')
  @ApiTags('property')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(propertyImageFileInterceptor)
  @UpdateApiDocs()
  async updateProperty(@Param('id') property_id: string,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
    @Body() updateProperty: updatedPropertyDto,
  ) {

    const result = await this.propertyService.updateProperty(property_id, files, updateProperty);
    return result;

  }
  @Get('user/:id')
  @ApiTags('property')
  async findbyuserId(@Param('id') user_id: string) {
    return this.propertyService.findbyuserId(user_id);
  }

  @Get(':id')
  async findById(@Param('id') propertyId: string) {
    return this.propertyService.findById(propertyId);
  }

  @Get()
  @FindAllApiDocs()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query() query: PropertyQueryDto,
  ) {
    const filters = {
      purpose: query.purpose,
      property_type: query.property_type,
      sub_type: query.sub_type,
      property_city: query.property_city,
    };

    return this.propertyService.findAll(page, pageSize, filters);
  }

  

}


