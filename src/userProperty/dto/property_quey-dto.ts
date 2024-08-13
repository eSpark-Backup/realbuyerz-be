/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class PropertyQueryDto {
  @ApiProperty({ required: false, description: 'The page number', example: 1 })
  @IsOptional()
  readonly page: number = 1;

  @ApiProperty({
    required: false,
    description: 'The number of items per page',
    example: 10,
  })
  @IsOptional()
  readonly pageSize: number = 10;

  @ApiProperty({
    required: false,
    description: 'The purpose of the property',
    example: 'Sale',
  })
  @IsOptional()
  @IsString({ message: 'Purpose must be a string' })
  @IsNotEmpty({ message: 'Purpose cannot be empty' })
  readonly purpose?: string;

  @ApiProperty({
    required: false,
    description: 'The type of the property',
    example: 'House',
  })
  @IsOptional()
  @IsString({ message: 'Property type must be a string' })
  @IsNotEmpty({ message: 'Property type cannot be empty' })
  readonly propertyType?: string;

  @ApiProperty({
    required: false,
    description: 'The sub-type of the property',
    example: 'Flat',
  })
  @IsOptional()
  @IsString({ message: 'Property sub-type must be a string' })
  readonly subType?: string;

  @ApiProperty({
    required: false,
    description: 'The city of the property',
    example: 'New York',
  })
  @IsOptional()
  @IsString({ message: 'Property city must be a string' })
  readonly propertyCity?: string;

  @ApiProperty({
    required: false,
    description: 'The id of the property',
    example: '1',
  })
  @IsOptional()
  @IsString({ message: 'Property id must be a string' })
  readonly propertyId?: string;
}
