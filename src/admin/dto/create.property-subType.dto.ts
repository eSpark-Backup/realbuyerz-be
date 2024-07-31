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
} from 'class-validator';

export class PropertySubTypeDto {
  @ApiProperty({ type: String, example: 'Apartment' })
  @IsString()
  @IsNotEmpty()
  readonly subTypeName: string;

  @ApiProperty({ type: String, example: 'UUID' })
  @IsUUID()
  @IsNotEmpty()
  readonly propertyTypeId: string;
}
