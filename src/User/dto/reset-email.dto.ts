/* eslint-disable prettier/prettier */
// email.dto.ts

import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty({ type: String })
  @IsEmail()
  to: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  content: string;
}
