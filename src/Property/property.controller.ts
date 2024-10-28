/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Optional,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PropertyService } from './property.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { CreatePropertyDto } from './dto/create-property.dto';
import { updatedPropertyDto } from './dto/update-property.dto';
import { PropertyQueryDto } from './dto/property_quey-dto';
import { propertyImageFileInterceptor } from 'src/utils/interceptor/propertyfile.interceptor';
import {
  CreateApiDocs,
  FindAllApiDocs,
  UpdateApiDocs,
} from 'src/utils/decorator/property.decorator';
import { JwtAuthGuard, RoleGuard } from 'src/utils/guard';
import { Roles } from 'src/utils/decorator/role.decorator';
import { swaggerDocs } from 'src/utils/decorator/swagger.decorator';
import { CONSTANT_RESPONSE } from 'src/utils/constant/return.constant';
import { UserId } from 'src/utils/decorator/userId.decorator';
import { OptionalRoleGuard } from 'src/utils/guard/optional.role.guard.';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('agent')
  @Post()
  @ApiTags('Agent Section')
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
    const result = await this.propertyService.createProperty(
      user_id,
      files,
      createProperty,
    );
    return result;
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('agent')
  @Put('/:id')
  @ApiTags('Agent Section')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(propertyImageFileInterceptor)
  @UpdateApiDocs()
  async updateProperty(
    @Param('id') property_id: string,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
    @Body() updateProperty: updatedPropertyDto,
  ) {
    const result = await this.propertyService.updateProperty(
      property_id,
      files,
      updateProperty,
    );
    return result;
  }

  @ApiBearerAuth('jwt')
  @Roles('agent')
  @ApiTags('Agent Section')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @swaggerDocs({
    summary: 'Find All Request of User/Customer which is saved by Agent',
    type: null,
    goodResponse: {
      status: 201,
      description: 'Find All Saved Request of User/Customer by Agent',
    },
    badresponse: { status: 400, description: 'Property Not Added' },
  })
  @Get('request')
  async findPropertyRequest(@UserId() userId: string) {
    return this.propertyService.getAllSavedProperties(userId);
  }

  @ApiBearerAuth('jwt')
  @Roles('agent')
  @ApiTags('Agent Section')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @swaggerDocs({
    summary: 'Save Request of User/Customer to Agent Side',
    type: null,
    goodResponse: {
      status: 201,
      description: 'Add Property Request to Favourites of Agent ',
    },
    badresponse: { status: 400, description: 'Property Not Added' },
  })
  @Post('/:propertyId')
  async savePropertyRequest(
    @UserId() userId: string,
    @Param('propertyId') propertyId: string,
  ) {
    const result = await this.propertyService.saveOrRemovePropertyRequest(
      userId,
      propertyId,
    );
    if (!result) {
      throw new HttpException(
        CONSTANT_RESPONSE.PROPERTY_NOT_ADDED,
        HttpStatus.BAD_REQUEST,
      );
    }
    return result;
  }
  @Roles('agent')
  @ApiTags('Agent Section')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @swaggerDocs({
    summary: 'Get all properties of Agent',
    type: null,
    goodResponse: {
      status: 201,
      description: 'Find All Properties listed by Agent',
    },
    badresponse: { status: 400, description: 'Properties Not Found' },
  })
  @Roles('agent')
  @Get('agent')
  @ApiTags('Agent Section')
  async findbyuserId(
    @UserId() user_id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query() query: PropertyQueryDto,
  ) {
    const filters = {
      purpose: query.purpose,
      propertyCity: query.propertyCity,
      propertyId: query.propertyId,
      propertyType: query.propertyType,
      subType: query.subType,
      proposals: query.proposals,
      status: query.status,
    };
    return this.propertyService.findbyuserId(user_id, page, pageSize, filters);
  }

  @Delete('/:id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiTags('Agent Section')
  @Roles('agent')
  async deleteProperty(@Param('id') id: string, @UserId() user_id: string) {
    const result = await this.propertyService.deleteProperty(id, user_id);
    return result;
  }

  // @Roles('user')
  // @Get(':id')
  // async findById(@Param('id') propertyId: string) {
  //   return this.propertyService.findById(propertyId);
  // }

  @Get()
  @FindAllApiDocs()
  @ApiBearerAuth('jwt')
  @UseGuards(OptionalRoleGuard)
  @swaggerDocs({
    summary: 'Find All request of User/Customer including Saved Leads',
    type: null,
    goodResponse: {
      status: 201,
      description: 'Find All Request listed by Customer including Saved Leads',
    },
    badresponse: { status: 400, description: 'Properties Not Found' },
  })
  @ApiTags('Find All Request listed by Customer/User')
  async findAll(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query() query: PropertyQueryDto,
  ) {
    const filters = {
      purpose: query.purpose,
      propertyCity: query.propertyCity,
      propertyId: query.propertyId,
      propertyType: query.propertyType,
      subType: query.subType,
    };

    return this.propertyService.findAll(req, page, pageSize, filters);
  }
}
