/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber  } from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty({ type: String, example: 'Beautiful House' })
  @IsString({ message: 'Property name must be a string' })
  @IsNotEmpty({ message: 'Property name cannot be empty' })
  readonly property_name: string;
  
  @ApiProperty({ type: Number, example: 1 })
  @IsNumber({}, { message: 'User ID must be a number' })
  @IsNotEmpty({ message: 'User ID cannot be empty' })
  readonly user_id: number;

  
  @ApiProperty({ type: String, example: 'House' })
  @IsString({ message: 'Property type must be a string' })
  @IsNotEmpty({ message: 'Property type cannot be empty' })
  readonly property_type: string;
  
  @ApiProperty({ type: String, example: 'Flat' })
  @IsString({ message: 'Property  Sub type must be a string' })
  @IsNotEmpty({ message: 'Property type cannot be empty' })
  readonly sub_type: string;

  @ApiProperty({ type: Number, example: 500000 })
  @IsNumber({}, { message: 'Property price must be a number' })
  @IsNotEmpty({ message: 'Property price cannot be empty' })
  readonly property_price: number;

  @ApiProperty({ type: Number, example: 2000 })
  @IsNumber({}, { message: 'Property area must be a number' })
  @IsNotEmpty({ message: 'Property area cannot be empty' })
  readonly property_area: number;

  @ApiProperty({ type: String, example: 'Sale' })
  @IsString({ message: 'Purpose must be a string' })
  @IsNotEmpty({ message: 'Purpose cannot be empty' })
  readonly purpose: string;

  @ApiProperty({ type: String, example: '123 Main St' })
  @IsString({ message: 'Property address must be a string' })
  @IsNotEmpty({ message: 'Property address cannot be empty' })
  readonly property_address: string;

  @ApiProperty({ type: String, example: 'YourCity' })
  @IsString({ message: 'Property city must be a string' })
  @IsNotEmpty({ message: 'Property city cannot be empty' })
  readonly property_city: string;

 


  @ApiProperty({ type: String, example: '12345' })
  @IsString({ message: 'Property zip must be a string' })
  @IsNotEmpty({ message: 'Property zip cannot be empty' })
  readonly property_zip: string;

  @ApiProperty({ type: String, example: 'A wonderful property for sale' })
  @IsString({ message: 'Property description must be a string' })
  @IsNotEmpty({ message: 'Property description cannot be empty' })
  readonly property_description: string;

 

  @ApiProperty({ type: String, example: 'wwww.buyerz.com/video.mp4' })
  @IsNumber({}, { message: 'Property video must be a URL' })
  @IsNotEmpty({ message: 'Property video cannot be empty' })
  readonly property_video: string;

  @ApiProperty({ type: String, example: 'www.buyerz.com/image.mp4' })
  @IsNumber({}, { message: 'Property image must be a URL' })
  @IsNotEmpty({ message: 'Property image cannot be empty' })
  readonly property_image: string;

  @ApiProperty({ type: String, example: '123.456' })
  @IsString({ message: 'Longitude must be a string' })
  @IsNotEmpty({ message: 'Longitude cannot be empty' })
  readonly longitude: string;

  @ApiProperty({ type: String, example: '78.910' })
  @IsString({ message: 'Latitude must be a string' })
  @IsNotEmpty({ message: 'Latitude cannot be empty' })
  readonly latitude: string;

  @ApiProperty({ type: String, example: 'True ',default:false })
  @IsString({ message: 'Property status must be a string' })
  @IsNotEmpty({ message: 'Property status cannot be empty' })
  readonly property_status: boolean;
}
