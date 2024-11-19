/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class PropertyQueryDto {
  @ApiProperty({ required: false, description: 'The page number', example: 1 })
  @IsOptional()
  readonly page?: number = 1;

  @ApiProperty({
    required: false,
    description: 'The number of items per page',
    example: 10,
  })
  @IsOptional()
  readonly pageSize?: number = 10;

  @ApiProperty({
    required: false,
    description: 'The name of the property',
    example: 'Beautiful House',
  })
  @IsOptional()
  readonly propertyName?: string;

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
    description: 'The Price of the property',
    example: '1000',
  })
  @IsOptional()
  @IsString({ message: 'Price must be a string' })
  @IsNotEmpty({ message: 'Price cannot be empty' })
  readonly price1?: string;

  @ApiProperty({
    required: false,
    description: 'The Price of the property',
    example: '2000',
  })
  @IsOptional()
  @IsString({ message: 'Price must be a string' })
  @IsNotEmpty({ message: 'Price cannot be empty' })
  readonly price2?: string;

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

  @ApiProperty({
    required: false,
    description: 'Get Proposal Status (Draft or published)',
  })
  @IsOptional()
  @IsString({ message: 'Get Agent Proposals Status' })
  readonly propertyStatus?: boolean;

  @ApiProperty({
    required: false,
    description: 'Get Proposals',
  })
  @IsOptional()
  @IsString({ message: 'Get Agent Proposals' })
  readonly proposals?: boolean;
}
