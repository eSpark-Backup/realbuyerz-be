/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { propertyImageFileInterceptor } from 'src/utils/interceptor/propertyfile.interceptor';
import { AdminGuard, JwtAuthGuard } from 'src/utils/guard';
import { Roles } from 'src/utils/decorator/role.decorator';
import { UserId } from 'src/utils/decorator/userId.decorator';
import { CreateAmenityDto } from './dto/create.amenities.dto';
import { PropertyTypeDto } from './dto/create.property.type.dto';
import { PropertySubTypeDto } from './dto/create.property-subType.dto';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Roles('admin')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('amenities')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(propertyImageFileInterceptor)
  async createSingleProperty(
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
    @UserId() userId: string,
    @Body() createAmenitiesDto: CreateAmenityDto,
  ) {
    return await this.adminService.createAmenities(
      userId,
      files,
      createAmenitiesDto,
    );
  }

  @Get('amenities')
  async getAllAmenities() {
    return await this.adminService.getAllAmenities();
  }
  @Roles('admin')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('propertyType')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(propertyImageFileInterceptor)
  async createPropertyType(
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
    @UserId() userId: string,
    @Body() propertyTypeDto: PropertyTypeDto,
  ) {
    return await this.adminService.createPropertyType(
      userId,
      files,
      propertyTypeDto,
    );
  }
  @Get('propertyType')
  async getAllPropertyType() {
    return await this.adminService.getAllPropertyType();
  }

  @Roles('admin')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('propertySubType')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(propertyImageFileInterceptor)
  async createPropertySubType(
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
    @UserId() userId: string,
    @Body() propertySubTypeDto: PropertySubTypeDto,
  ) {
    return await this.adminService.createPropertySubType(
      userId,
      files,
      propertySubTypeDto,
    );
  }
}
