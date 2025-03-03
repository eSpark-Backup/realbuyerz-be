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
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserPropertyDto } from './dto/create-property.dto';
import { UserPropertyService } from './userProperty.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  CreateApiDocs,
  FindAllApiDocs,
} from 'src/utils/decorator/property.decorator';
import { JwtAuthGuard, RoleGuard } from 'src/utils/guard';
import { Roles } from 'src/utils/decorator/role.decorator';
import { UserId } from 'src/utils/decorator/userId.decorator';
import { updateUserPropertyDto } from './dto/update-property.dto';
import { PropertyQueryDto } from './dto/property_quey-dto';
import { swaggerDocs } from 'src/utils/decorator/swagger.decorator';
import { UserRoleGuard } from 'src/utils/guard/user.guard';
import { CONSTANT_RESPONSE } from 'src/utils/constant/return.constant';
import { OptionalRoleGuard } from 'src/utils/guard/optional.role.guard.';

@Controller('userProperty')
export class UserPropertyController {
  constructor(private readonly userPropertyService: UserPropertyService) {}

  @ApiBearerAuth()
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @Roles('user')
  @ApiTags('User Request Section')
  @Post()
  async createProperty(
    @UserId() userId: string,
    @Body() createProperty: CreateUserPropertyDto,
  ) {
    const result = await this.userPropertyService.createProperty(
      userId,
      createProperty,
    );
    return result;
  }

  @ApiBearerAuth()
  @ApiBearerAuth('jwt')
  @ApiTags('User Request Section')
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @Roles('user')
  @Put('/:id')
  async updateProperty(
    @Body() updateProperty: updateUserPropertyDto,
    @Param('id') id: string,
  ) {
    const result = await this.userPropertyService.updateProperty(
      updateProperty,
      id,
    );
    return result;
  }

  @ApiBearerAuth('jwt')
  @ApiTags('User Request Section')
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @swaggerDocs({
    summary: 'Get all Request listed By User',
    type: null,
    goodResponse: {
      status: 201,
      description: 'Find All Properties listed by User',
    },
    badresponse: { status: 400, description: 'Properties Not Found' },
  })
  @Roles('user')
  @Get('user')
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
      status: query.propertyStatus,
      price1: query.price1,
      price2: query.price2,
      area1: query.area1,
      area2: query.area2,
    };
    return this.userPropertyService.findbyuserId(
      user_id,
      page,
      pageSize,
      filters,
    );
  }

  @Get()
  @FindAllApiDocs()
  @ApiBearerAuth('jwt')
  @UseGuards(OptionalRoleGuard)
  @ApiTags('Find All Properties Listed by Agent')
  async findAll(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query() query: PropertyQueryDto,
  ) {
    const filters = {
      propertyName: query.propertyName,
      purpose: query.purpose,
      propertyCity: query.propertyCity,
      propertyId: query.propertyId,
      propertyType: query.propertyType,
      subType: query.subType,
      price1: query.price1,
      price2: query.price2,
      area1: query.area1,
      area2: query.area2,
      agentId: query.agentId,
    };

    return this.userPropertyService.findAll(req, page, pageSize, filters);
  }

  @ApiBearerAuth()
  @ApiTags('User Request Section')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @Roles('user')
  @Delete('/:id')
  async deleteProperty(@Param('id') id: string, @UserId() userId: string) {
    const result = await this.userPropertyService.deleteProperty(id, userId);
    return result;
  }

  @ApiBearerAuth('jwt')
  @Roles('agent')
  @ApiTags('User Request Section')
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @swaggerDocs({
    summary: 'Find All  Properties  saved By User/Customer',
    type: null,
    goodResponse: {
      status: 201,
      description: 'Find All Saved Property of User/Customer',
    },
    badresponse: { status: 400, description: 'Property Not Added' },
  })
  @Get('request')
  async findPropertyRequest(@UserId() userId: string,
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
 ) {
    return this.userPropertyService.getAllSavedProperties(userId,page, pageSize);
  }

  @ApiBearerAuth('jwt')
  @Roles('user')
  @ApiTags('User Request Section')
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @swaggerDocs({
    summary: 'Save Property of Agent to user Favourites',
    type: null,
    goodResponse: {
      status: 201,
      description: 'Add Property Request to Favourites',
    },
    badresponse: { status: 400, description: 'Property Not Added' },
  })
  @Post('/:propertyId')
  async savePropertyRequest(
    @UserId() userId: string,
    @Param('propertyId') propertyId: string,
  ) {
    const result = await this.userPropertyService.saveOrRemovePropertyRequest(
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
}
