/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ApiProperty  } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, ValidateNested, IsNotEmpty   } from 'class-validator';



export class updatedPropertyDto {
  @ApiProperty({ type: String, example: 'Beautiful House',required:false })
  @IsString({ message: 'Property name must be a string' })
 @IsOptional()

  readonly property_name: string;
  
 @ApiProperty({ type:Number, example: 'User ID',required:false  })
 @IsOptional()
  readonly user_id: any;

  
  @ApiProperty({ type: String, example: 'House',required:false  })
  @IsString({ message: 'Property type must be a string' })
 @IsOptional()

  readonly property_type: string;
  
  @ApiProperty({ type: String, example: 'Flat',required:false  })
  @IsString({ message: 'Property  Sub type must be a string' })
  @IsOptional()
  readonly sub_type: string;

  @ApiProperty({ type: String, example: 500000,required:false })
  @IsString({ message: 'Property price must be a number' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property price cannot be empty' })
  readonly property_price: any;

  @ApiProperty({ type: String, example: 2000 ,required:false })
  @IsString( { message: 'Property area must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property area cannot be empty' })
  readonly property_area: string;

  @ApiProperty({ type: String, example: 'Sale',required:false  })
  @IsString({ message: 'Purpose must be a string' })
  @IsOptional()
  readonly purpose: string;

  @ApiProperty({ type: String, example: '123 Main St' ,required:false })
  @IsString({ message: 'Property address must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property address cannot be empty' })
  readonly property_address: string;




  @ApiProperty({ type: String, example: '12345',required:false  })
  @IsString({ message: 'Property zip must be a string' })
  // @IsNotEmpty({ message: 'Property zip cannot be empty' })
  @IsOptional()

  readonly property_zip: string;

  @ApiProperty({ type: String, example: 'A wonderful property for sale',required:false  })
  @IsString({ message: 'Property description must be a string' })
  // @IsNotEmpty({ message: 'Property description cannot be empty' })
  @IsOptional()
  readonly property_description: string;

  @ApiProperty({ type: String, example: 'Karachi',required:false})
  @IsString({ message: 'Property city must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property city cannot be empty' })
  readonly property_city: string;


  @ApiProperty({ type: String, example: '123.456',required:false  })
  @IsString({ message: 'Longitude must be a string' })
  @IsOptional()

  // @IsNotEmpty({ message: 'Longitude cannot be empty' })
  readonly longitude: string;

  @ApiProperty({ type: String, example: '78.910',required:false  })
  @IsString({ message: 'Latitude must be a string' })
  @IsOptional()

  // @IsNotEmpty({ message: 'Latitude cannot be empty' })
  readonly latitude: string;

  @ApiProperty({ type: Boolean, example: 'True ',default:false,required:false  })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property status cannot be empty' })
  readonly property_status: boolean;


  @ApiProperty({ type: String, example: 'Swimming Pool ' })
  @IsString()
  @IsOptional()
  readonly amenities_name: string;

  @ApiProperty({example: '1' })
  @IsString()
  @IsOptional()
  readonly count: any;

  @ApiProperty({ type: String, example: 'Waterfall ' })
  @IsString()
  @IsOptional()
  readonly other_features: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    example: ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg'],
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'At least one image is required' })
  readonly image: any[];
  

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



