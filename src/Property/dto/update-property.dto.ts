/* eslint-disable prettier/prettier */
import { ApiProperty  } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional  } from 'class-validator';

export class updatedPropertyDto {
  


  @ApiProperty({ type: String, example: 'Beautiful House' })
  @IsString({ message: 'Property name must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property name cannot be empty' })
  readonly property_name: string;
  
 

  
  @ApiProperty({ type: String, example: 'House' })
  @IsString({ message: 'Property type must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property type cannot be empty' })
  readonly property_type: string;
  
  @ApiProperty({ type: String, example: 'Flat' })
  @IsString({ message: 'Property  Sub type must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property type cannot be empty' })
  readonly sub_type: string;

  @ApiProperty({ type: Number, example: 500000 })
  @IsNumber({}, { message: 'Property price must be a number' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property price cannot be empty' })
  readonly property_price: number;

  @ApiProperty({ type: String, example: 2000 })
  @IsString( { message: 'Property area must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property area cannot be empty' })
  readonly property_area: string;

  @ApiProperty({ type: String, example: 'Sale' })
  @IsString({ message: 'Purpose must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Purpose cannot be empty' })
  readonly purpose: string;

  @ApiProperty({ type: String, example: '123 Main St' })
  @IsString({ message: 'Property address must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property address cannot be empty' })
  readonly property_address: string;

  
 
  
  @ApiProperty({ type: String, example: 'www.buyerz.com/image.mp4' })
  @IsString( { message: 'Property image must be a URL' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property image cannot be empty' })
  readonly property_Image: string;

  @ApiProperty({ type: String, example: 'wwww.buyerz.com/video.mp4' })
  @IsString( { message: 'Property video must be a URL' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property video cannot be empty' })
  readonly property_video: string;



  @ApiProperty({ type: String, example: '12345' })
  @IsString({ message: 'Property zip must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property zip cannot be empty' })
  readonly property_zip: string;

  @ApiProperty({ type: String, example: 'A wonderful property for sale' })
  @IsString({ message: 'Property description must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property description cannot be empty' })
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

  @ApiProperty({ type: Boolean, example: 'True ',default:false })
  @IsString({ message: 'Property status must be a string' })
  @IsOptional()
  // @IsNotEmpty({ message: 'Property status cannot be empty' })
  readonly property_status: boolean;
}
