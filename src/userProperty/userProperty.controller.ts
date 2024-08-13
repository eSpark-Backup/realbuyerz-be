/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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

@Controller('userProperty')
@ApiBearerAuth()
@ApiTags('User Property Proposals')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserPropertyController {
  constructor(private readonly userPropertyService: UserPropertyService) {}
  @Roles('user')
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @swaggerDocs({
    summary: 'Get all properties of User',
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
  async findAll(
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

    return this.userPropertyService.findAll(page, pageSize, filters);
  }

  @Roles('user')
  @Delete('/:id')
  async deleteProperty(@Param('id') id: string, @UserId() userId: string) {
    const result = await this.userPropertyService.deleteProperty(id, userId);
    return result;
  }
}
