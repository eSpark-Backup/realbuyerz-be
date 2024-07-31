/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  IsUrl,
  ArrayMinSize,
  ArrayMaxSize,
  IsUUID,
  IsArray,
} from 'class-validator';

class AmenityDto {
  @IsString()
  @IsOptional()
  readonly amenitiesName: string;

  @IsString()
  @IsOptional()
  readonly count: any;

  @IsString()
  @IsOptional()
  readonly otherFeatures: string;
}

export class CreatePropertyDto {
  @ApiProperty({ type: String, example: 'Beautiful House' })
  @IsString({ message: 'Property name must be a string' })
  @IsNotEmpty({ message: 'Property name cannot be empty' })
  readonly propertyName: string;

  userId: any;

  readonly propertyBy: string;

  @ApiProperty({ type: String, example: 'UUID' })
  @IsUUID()
  @IsNotEmpty()
  readonly propertySubTypeId: string;

  @ApiProperty({ type: String, example: 500000 })
  @IsString({ message: 'Property price must be a number' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property price cannot be empty' })
  readonly propertyPrice: any;

  @ApiProperty({ type: String, example: 2000 })
  @IsString({ message: 'Property area must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property area cannot be empty' })
  readonly propertyArea: string;

  @ApiProperty({ type: String, example: 'Sale' })
  @IsString({ message: 'Purpose must be a string' })
  @IsNotEmpty({ message: 'Purpose cannot be empty' })
  readonly purpose: string;

  @ApiProperty({ type: String, example: '123 Main St' })
  @IsString({ message: 'Property address must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property address cannot be empty' })
  readonly propertyAddress: string;

  @ApiProperty({ type: String, example: 'Karachi' })
  @IsString({ message: 'Property city must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property city cannot be empty' })
  readonly propertyCity: string;

  @ApiProperty({ type: String, example: '12345' })
  @IsString({ message: 'Property zip must be a string' })
  // @IsNotEmpty({ message: 'Property zip cannot be empty' })
  @IsOptional()
  readonly propertyZip: string;

  @ApiProperty({ type: String, example: 'A wonderful property for sale' })
  @IsString({ message: 'Property description must be a string' })
  // @IsNotEmpty({ message: 'Property description cannot be empty' })
  @IsOptional()
  readonly propertyDescription: string;

  @ApiProperty({ type: String, example: '123.456' })
  @IsString({ message: 'Longitude must be a string' })
  @IsOptional()

  // @IsNotEmpty({ message: 'Longitude cannot be empty' })
  readonly longitude: string;

  @ApiProperty({ type: String, example: '78.910' })
  @IsString({ message: 'Latitude must be a string' })
  @IsOptional()

  // @IsNotEmpty({ message: 'Latitude cannot be empty' })
  readonly latitude: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    example: [
      'image1.jpg',
      'image2.jpg',
      'image3.jpg',
      'image4.jpg',
      'image5.jpg',
    ],
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'At least one image is required' })
  readonly image: any[];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'url',
    },
    example: [
      'https://www.youtube.com/watch?v=yourvideo1',
      'https://www.youtube.com/watch?v=yourvideo2',
    ],
    required: false,
  })
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  @IsOptional()
  readonly video?: any[];
  @ApiProperty({
    type: 'string',
    example: 'existing-amenity-id-1,existing-amenity-id-2',
    required: false,
  })
  @IsOptional()
  readonly amenities?: string | string[];

  @ApiProperty({
    type: Boolean,
    example: 'True ',
    default: false,
    required: false,
  })
  @IsString({ message: 'Property status must be a string' })
  @IsOptional()

  // @IsNotEmpty({ message: 'Property status cannot be empty' })
  readonly propertyStatus: boolean;

  imageKey?: string;

  // @ApiProperty({ type: Object, example: {
  //   "amenities_name": "Swimming Pool",
  //   "count": "1",
  //   "other_features": "Waterfall"
  // } })
  // @IsOptional()
  // @Type(() => AmenityDto)
  // readonly property_amenities?: AmenityDto;
}
