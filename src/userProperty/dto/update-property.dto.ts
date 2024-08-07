/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class updateUserPropertyDto {
  @ApiProperty({ type: String, example: 'Beautiful House', required: false })
  @IsString({ message: 'Property name must be a string' })
  @IsOptional()
  readonly propertyName: string;

  @ApiProperty({ type: String, example: 'UUID', required: false })
  @IsUUID()
  @IsOptional()
  readonly propertySubTypeId: string;

  @ApiProperty({ type: String, example: 500000, required: false })
  @IsString({ message: 'Property price must be a number' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property price cannot be empty' })
  readonly propertyPrice: any;

  @ApiProperty({ type: String, example: 2000, required: false })
  @IsString({ message: 'Property area must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property area cannot be empty' })
  readonly property_area: string;

  @ApiProperty({ type: String, example: 'Sale', required: false })
  @IsString({ message: 'Purpose must be a string' })
  @IsOptional()
  readonly purpose: string;

  @ApiProperty({ type: String, example: '123 Main St', required: false })
  @IsString({ message: 'Property address must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property address cannot be empty' })
  readonly propertyAddress: string;

  @ApiProperty({ type: String, example: '12345', required: false })
  @IsString({ message: 'Property zip must be a string' })
  // @IsNotEmpty({ message: 'Property zip cannot be empty' })
  @IsOptional()
  readonly propertyZip: string;

  @ApiProperty({
    type: String,
    example: 'A wonderful property for sale',
    required: false,
  })
  @IsString({ message: 'Property description must be a string' })
  // @IsNotEmpty({ message: 'Property description cannot be empty' })
  @IsOptional()
  readonly propertyDescription: string;

  @ApiProperty({ type: String, example: 'Karachi', required: false })
  @IsString({ message: 'Property city must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property city cannot be empty' })
  readonly propertyCity: string;

  @ApiProperty({ type: String, example: '123.456', required: false })
  @IsString({ message: 'Longitude must be a string' })
  @IsOptional()

  // @IsNotEmpty({ message: 'Longitude cannot be empty' })
  readonly longitude: string;

  @ApiProperty({ type: String, example: '78.910', required: false })
  @IsString({ message: 'Latitude must be a string' })
  @IsOptional()

  // @IsNotEmpty({ message: 'Latitude cannot be empty' })
  readonly latitude: string;

  @ApiProperty({
    type: Boolean,
    example: 'True ',
    default: false,
    required: false,
  })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property status cannot be empty' })
  readonly propertyStatus: boolean;

  @ApiProperty({
    type: 'string',
    example: 'existing-amenity-id-1,existing-amenity-id-2',
    required: false,
  })
  @IsOptional()
  readonly amenities?: string | string[];

  //   @ApiProperty({ type: Object, example:  {
  //     "amenities_name": "Swimming Pool",
  //     "count": 1,
  //     "other_features": "Waterfall"
  //   } })
  //   @IsOptional()
  //   @ValidateNested({ each: true })
  //   @Type(() => AmenityDto)
  //   property_amenities?: AmenityDto[];
}

// class AmenityDto {
//   @IsString()
//   @IsOptional()
//   amenities_name: string;

//   @IsString()
//   @IsOptional()

//   count: any;

//   @IsString()
//   @IsOptional()

//   other_features: string;
// }
