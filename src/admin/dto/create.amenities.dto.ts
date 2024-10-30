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
  IsNumber,
} from 'class-validator';

export class CreateAmenityDto {
  @ApiProperty({ type: String, example: 'Swimming Pool' })
  @IsString()
  @IsOptional()
  readonly amenitiesName: string;

  // @ApiProperty({ type: Number, example: 1 })
  // @IsOptional()
  // readonly count: any;

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

  imageKey?: string;
}

// @ApiProperty({ type: Object, example: {
//   "amenities_name": "Swimming Pool",
//   "count": "1",
//   "other_features": "Waterfall"
// } })
// @IsOptional()
// @Type(() => AmenityDto)
// readonly property_amenities?: AmenityDto;
