/* eslint-disable prettier/prettier */
// src/user/dto/verify-otp.dto.ts

import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ description: 'Phone number for which OTP was sent' })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('PK', { message: 'Invalid phone number' })
  readonly phoneNumber: string;

  @ApiProperty({ description: 'OTP to be verified' })
  @IsNotEmpty()
  @IsString()
  readonly otp: string;

  @ApiProperty({ description: 'Hash received during OTP generation' })
  @IsNotEmpty()
  @IsString()
  readonly hash: string;
}
