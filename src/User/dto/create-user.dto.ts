/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// src/user/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
enum UserRole {
  User = 'user',
  Agent = 'agent',
}

export class CreateUserDto {

  
  @ApiProperty({ type: String ,default:'Ahsan'})
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  readonly firstName: string;

  @ApiProperty({ type: String,default:'Badami' })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  readonly lastName: string;

  @ApiProperty({ type: String,default:'ahsan@mail.com'})
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  readonly email: string;

  @ApiProperty({ type: String,required:false })
  @IsString({ message: 'Mobile number must be a string' })
  @IsNotEmpty({ message: 'Mobile number cannot be empty' })
  readonly mobileNumber: string;

 
  @ApiProperty({ type: String ,required:false })
  @IsString({ message: 'Password must be a string' })
  @IsOptional()
  readonly password?: string;

  @ApiProperty({ type: String  ,required:false})
  @IsString({ message: 'Profile Image must be a string' })
  @IsOptional()
  readonly profileImage?: string;
 
  @ApiProperty({ enum: UserRole, default: UserRole.User })
  @IsEnum(UserRole, { message: 'Invalid role. Must be either "user" or "agent".' })
  @IsOptional()
  readonly role: string;

  readonly socialLogin?:boolean;


  @ApiProperty({ type: String ,required:false })
  @IsString({ message: 'Social id must be a string' })
  @IsOptional()
  readonly socialId: string;





}
