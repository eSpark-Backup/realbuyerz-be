/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// src/user/dto/update-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsBooleanString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  isBoolean,
} from 'class-validator';
// enum UserRole {
//     agent = 'agent',
//     user = 'user',
//     // Add other roles as needed
// }

export class UpdateUserDto {
  @ApiProperty({ type: String, required: false })
  @IsString({ message: 'First name must be a string' })
  @IsOptional()
  readonly firstName: string;

  @ApiProperty({ type: String, required: false })
  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
  readonly lastName: string;

  //   @ApiProperty({ type: String, default: 'ahsan@mail.com', required: false })
  //   @IsEmail({}, { message: 'Invalid email format' })
  //   @IsOptional()
  //   readonly email: string;

  // @ApiProperty({ type: String, required: false })
  // @IsString({ message: 'Mobile number must be a string' })
  // @IsOptional()

  // readonly mobileNumber: string;

  @ApiProperty({ type: String, required: false })
  @IsString({ message: 'Landline number must be a string' })
  @IsOptional()
  readonly landlineNumber?: string;

  @ApiProperty({ type: String, required: false })
  @IsString({ message: 'Whatsapp number must be a string' })
  @IsOptional()
  readonly whatsapp?: string;

  @ApiProperty({ type: String, required: false })
  @IsString({ message: 'Country  must be a string' })
  @IsOptional()
  readonly country?: string;

  @ApiProperty({ type: String, required: false })
  @IsString({ message: ' address must be a string' })
  @IsOptional()
  readonly address?: string;

  // @ApiProperty({ type: String, required: false })
  // @IsString({ message: 'Profile image must be a string' })
  // @IsOptional()
  readonly profileImage: string;

  // @ApiProperty({ enum: UserRole, required: false })
  // @IsEnum(UserRole, { message: 'Invalid role' })
  // @IsOptional()
  // readonly role: UserRole;

  @ApiProperty({ type: String, required: false })
  @IsString({ message: 'Social id must be a string' })
  @IsOptional()
  readonly socialId: string;

  @ApiProperty({ type: String, required: false })
  @IsString({ message: 'city must be a string' })
  @IsOptional()
  readonly city: string;

  @ApiProperty({ type: Boolean, default: false, required: false })
  @IsOptional()
  readonly isVerified: boolean;

  @ApiProperty({ type: Boolean, default: false, required: false })
  @IsOptional()
  readonly profileVisibility: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    example: 'image1.jpg',
    required: false,
  })
  @IsOptional()
  readonly image: [];
}
