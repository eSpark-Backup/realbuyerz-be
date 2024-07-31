/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserPropertyDto } from './dto/create-property.dto';
import { UserPropertyService } from './userProperty.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateApiDocs } from 'src/utils/decorator/property.decorator';
import { JwtAuthGuard, RoleGuard } from 'src/utils/guard';
import { Roles } from 'src/utils/decorator/role.decorator';
import { UserId } from 'src/utils/decorator/userId.decorator';
import { updateUserPropertyDto } from './dto/update-property.dto';

@Controller('userProperty')
@ApiBearerAuth()
@ApiTags('User Property Proposals')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserPropertyController {
  constructor(private readonly userPropertyService: UserPropertyService) {}
  @Roles('user')
  @Post()
  @ApiTags('User Request Property')
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
  @Put(':id')
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

  @Roles('user')
  @Delete(':id')
  async deleteProperty(@Param('id') id: string) {
    const result = await this.userPropertyService.deleteProperty(id);
    return result;
  }
}
