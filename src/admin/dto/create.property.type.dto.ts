/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { PropertySubTypeDto } from './create.property-subType.dto'; // Import PropertySubTypeDto

export class PropertyTypeDto {
  @ApiProperty({ type: String, example: 'Residential' })
  @IsString()
  @IsNotEmpty()
  readonly typeName: string;
}
