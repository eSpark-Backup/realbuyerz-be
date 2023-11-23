/* eslint-disable prettier/prettier */
// src/user/dto/send-otp.dto.ts

import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ description: 'Phone number to which OTP will be sent' })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('PK', { message: 'Invalid phone number' })
  readonly phoneNumber: string;
}
