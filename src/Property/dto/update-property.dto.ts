/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUrl,
  IsUUID,
  IsArray,
} from 'class-validator';
class AmenityDto {
  @ApiProperty({ description: 'The name of the amenity', example: 'Bedroom' })
  name: string;

  @ApiProperty({
    description: 'The count of the amenity, if applicable',
    example: 1,
    required: false,
  })
  count?: number;
}
export class updatedPropertyDto {
  @ApiProperty({ type: String, example: 'Beautiful House', required: false })
  @IsString({ message: 'Property name must be a string' })
  @IsOptional()
  readonly propertyName: string;

  @ApiProperty({ type: String, example: 'UUID', required: false })
  @IsUUID()
  @IsOptional()
  readonly propertySubTypeId: string;

  @ApiProperty({ type: String, example: 'House', required: false })
  @IsString({ message: 'Property type must be a string' })
  @IsOptional()
  readonly propertyType: string;

  @ApiProperty({ type: String, example: 'Flat', required: false })
  @IsString({ message: 'Property  Sub type must be a string' })
  @IsOptional()
  readonly subType: string;

  @ApiProperty({ type: String, example: 500000, required: false })
  @IsString({ message: 'Property price must be a number' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property price cannot be empty' })
  readonly propertyPrice: any;

  @ApiProperty({ type: String, example: 2000, required: false })
  @IsString({ message: 'Property area must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property area cannot be empty' })
  readonly propertyArea: string;

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
    type: 'array',
    items: {
      type: 'string',
    },
    example: [
      '4_z5dd8159e24980ba992280117_f103bfe305c750225_d20240930_m110108_c005_v0501025_t0017_u01727694068103',
    ],
    required: false,
  })
  @IsString({ each: true })
  @IsOptional()
  readonly imageKeys?: any[];

  // @ApiProperty({
  //   type: 'string',
  //   example: 'existing-amenity-id-1,existing-amenity-id-2',
  //   required: false,
  // })
  // @IsOptional()
  // readonly amenities?: string | string[];

  @ApiProperty({
    description: 'List of amenities available in the property',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Bedroom' },
        count: { type: 'number', example: 1 },
        imageUrl: { type: 'string', example: 'http://example.com/image.jpg' },
      },
    },
  })
  amenity: any;

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
