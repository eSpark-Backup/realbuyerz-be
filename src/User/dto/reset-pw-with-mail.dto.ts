/* eslint-disable prettier/prettier */
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordwithMailDto {
  @ApiProperty({ type: String })
  @IsString()
  password: string;


 
}
