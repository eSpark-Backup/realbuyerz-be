/* eslint-disable prettier/prettier */
// src/user/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: String })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  readonly firstName: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  readonly lastName: string;

  @ApiProperty({ type: String })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  readonly email: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Mobile number must be a string' })
  @IsNotEmpty({ message: 'Mobile number cannot be empty' })
  readonly mobileNumber: string;

  @ApiProperty({ type: String, required: false })
  @IsString({ message: 'Landline number must be a string' })
  @IsOptional()
  readonly landlineNumber?: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Country  must be a string' })
  @IsNotEmpty({ message: 'Country  cannot be empty' })
  readonly country: string;
  
  @ApiProperty({ type: String })
  @IsString({ message: ' address must be a string' })
  @IsNotEmpty({ message: ' address cannot be empty' })
  readonly Address: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  readonly password: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Profile image must be a string' })
  @IsNotEmpty({ message: 'Profile image cannot be empty' })
  readonly profileImage: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Role must be a string' })
  @IsNotEmpty({ message: 'Role cannot be empty' })
  readonly role: string;

}
