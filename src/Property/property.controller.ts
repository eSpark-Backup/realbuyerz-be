/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { PropertyService } from "./property.service";
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from "path";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { updatedPropertyDto } from "./dto/update-property.dto";
import { PropertyQueryDto } from "./dto/property_quey-dto";
import { propertyImageFileInterceptor } from "src/utils/interceptor/propertyfile.interceptor";
import { CreateApiDocs, FindAllApiDocs, UpdateApiDocs } from "src/utils/decorator/property.decorator";
import { JwtAuthGuard, RoleGuard } from "src/utils/guard";
import { Roles } from "src/utils/decorator/role.decorator";
import { swaggerDocs } from "src/utils/decorator/swagger.decorator";import { CONSTANT_RESPONSE } from "src/utils/constant/return.constant";
import { UserId } from "src/utils/decorator/userId.decorator";

@Controller('property')
@ApiTags('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) { }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('agent')
  @Post()
  @ApiTags('property')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(propertyImageFileInterceptor)
  @CreateApiDocs()
  async createProperty(
    @UserId() user_id: string,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
    @Body() createProperty: CreatePropertyDto,
  ) {
    const result = await this.propertyService.createProperty(user_id,files, createProperty);
    return result;
  }


  @ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('agent')
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



  @ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RoleGuard)
  @swaggerDocs({
    summary: 'Get all properties of User',
    type:null,
    goodResponse: { status: 201, description: 'Find All Properties listed by Agent' },
    badresponse: { status: 400, description: 'Properties Not Found' }
  })
  @Roles('user')
  @Get('user')
  @ApiTags('property')
  async findbyuserId(@UserId() user_id: string){
    return this.propertyService.findbyuserId(user_id);
  }

  // @Roles('user')
  // @Get(':id')
  // async findById(@Param('id') propertyId: string) {
  //   return this.propertyService.findById(propertyId);
  // }


  @Get()
  @FindAllApiDocs()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query() query: PropertyQueryDto,
  ) {
    const filters = {
      purpose: query.purpose,
      propertyType: query.propertyType,
      subType: query.subType,
      propertyCity: query.propertyCity,
      propertyBy: query.propertyBy,
      propertyId: query.propertyId,
    };

    return this.propertyService.findAll(page, pageSize, filters);
  }

  

}


