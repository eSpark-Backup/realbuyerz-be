/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserPropertyDto } from "./dto/create-property.dto";
import { UserPropertyService } from "./userProperty.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CreateApiDocs } from "src/utils/property.decorator";


@Controller('userProperty')
@ApiBearerAuth()
@ApiTags('User Request Property')
export class UserPropertyController {
    constructor(private readonly userPropertyService: UserPropertyService) { }
    @Post()
    @ApiTags('User Request Property')
    async createProperty(
        @Body() createProperty: CreateUserPropertyDto,
    ) {
        const result = await this.userPropertyService.createProperty(createProperty);
        return result;
    }


}