/* eslint-disable prettier/prettier */
// src/user/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';


export class CreateUserDto {

  
  @ApiProperty({ type: String })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  readonly first_name: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  readonly last_name: string;

  @ApiProperty({ type: String })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  readonly email: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Mobile number must be a string' })
  @IsNotEmpty({ message: 'Mobile number cannot be empty' })
  readonly mobile_number: string;

  @ApiProperty({ type: String, required: false })
  @IsString({ message: 'Landline number must be a string' })
  @IsOptional()
  readonly landline_number?: string;

  @ApiProperty({ type: String, required: false })
  @IsString({ message: 'Whatsapp number must be a string' })
  @IsOptional()
  readonly whatsapp?: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Country  must be a string' })
  @IsNotEmpty({ message: 'Country  cannot be empty' })
  readonly country?: string;
  
  @ApiProperty({ type: String })
  @IsString({ message: ' address must be a string' })
  @IsNotEmpty({ message: ' address cannot be empty' })
  readonly address?: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  readonly password: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Profile image must be a string' })
  @IsNotEmpty({ message: 'Profile image cannot be empty' })
  readonly profile_image: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Role must be a string' })
  @IsNotEmpty({ message: 'Role cannot be empty' })
  readonly role: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Social id must be a string' })
  @IsNotEmpty({ message: 'Social id cannot be empty' })
  readonly social_id: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Verified must be a Bool' })
  @IsNotEmpty({ message: 'Verified cannot be empty' })
  readonly isVerified: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'profile visibility must be a Bool' })
  @IsNotEmpty({ message: 'profile visibility cannot be empty' })
  readonly profile_visibility: boolean;



}
