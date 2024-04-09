/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CreateUserPropertyDto } from "./dto/create-property.dto";
import { UserPropertyService } from "./userProperty.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CreateApiDocs } from "src/utils/decorator/property.decorator";
import { JwtAuthGuard, RoleGuard } from "src/utils/guard";
import { Roles } from "src/utils/decorator/role.decorator";
import { UserId } from "src/utils/decorator/userId.decorator";


@Controller('userProperty')
@ApiBearerAuth()
@ApiTags('User Request Property')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserPropertyController {
    constructor(private readonly userPropertyService: UserPropertyService) { }
    @Roles('user')
    @Post()
    @ApiTags('User Request Property')
    async createProperty(
        @UserId() userId: string,
        @Body() createProperty: CreateUserPropertyDto,
    ) {
        const result = await this.userPropertyService.createProperty(userId,createProperty);
        return result;
    }


}