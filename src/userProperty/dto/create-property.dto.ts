/* eslint-disable prettier/prettier */
import { ApiProperty  } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty  } from 'class-validator';



export class CreateUserPropertyDto {
  @ApiProperty({ type: String, example: 'Beautiful House' })
  @IsString({ message: 'Property name must be a string' })
  @IsNotEmpty({ message: 'Property name cannot be empty' })
  readonly property_name: string;
  

  readonly user_id: any;

  
  @ApiProperty({ type: String, example: 'House' })
  @IsString({ message: 'Property type must be a string' })
  @IsNotEmpty({ message: 'Property type cannot be empty' })
  readonly property_type: string;
  
  @ApiProperty({ type: String, example: 'Flat' })
  @IsString({ message: 'Property  Sub type must be a string' })
  @IsNotEmpty({ message: 'Property Sub type cannot be empty' })
  readonly sub_type: string;

  @ApiProperty({ type: String, example: 500000 })
  @IsString({ message: 'Property price must be a number' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property price cannot be empty' })
  readonly property_price: any;

  readonly property_by: string;

  @ApiProperty({ type: String, example: 2000 })
  @IsString( { message: 'Property area must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property area cannot be empty' })
  readonly property_area: string;

  @ApiProperty({ type: String, example: 'Sale' })
  @IsString({ message: 'Purpose must be a string' })
  @IsNotEmpty({ message: 'Purpose cannot be empty' })
  readonly purpose: string;

  @ApiProperty({ type: String, example: '123 Main St' })
  @IsString({ message: 'Property address must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property address cannot be empty' })
  readonly property_address: string;

  @ApiProperty({ type: String, example: 'Karachi' })
  @IsString({ message: 'Property city must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property city cannot be empty' })
  readonly property_city: string;



  @ApiProperty({ type: String, example: '12345' })
  @IsString({ message: 'Property zip must be a string' })
  // @IsNotEmpty({ message: 'Property zip cannot be empty' })
  @IsOptional()
  readonly property_zip: string;

  @ApiProperty({ type: String, example: 'A wonderful property for sale' })
  @IsString({ message: 'Property description must be a string' })
  // @IsNotEmpty({ message: 'Property description cannot be empty' })
  @IsOptional()
  readonly property_description: string;



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

  // @ApiProperty({ type: Object, example: {
  //   "amenities_name": "Swimming Pool",
  //   "count": "1",
  //   "other_features": "Waterfall"
  // } })
  // @IsOptional()
  // @Type(() => AmenityDto)
  // readonly property_amenities?: AmenityDto;
}





