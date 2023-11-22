/* eslint-disable prettier/prettier */
// email.dto.ts

import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class EmailDto {
  @IsEmail()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
