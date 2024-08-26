// src/user/dto/upsert-preferences.dto.ts

import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpsertPreferencesDto {
  @ApiProperty({
    description: 'Email notifications preference',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly emailNotification: boolean;

  @ApiProperty({
    description: 'Newsletter subscription preference',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly newsLetter: boolean;

  @ApiProperty({ description: 'Automated report preference', required: false })
  @IsOptional()
  @IsBoolean()
  readonly automatedReport: boolean;

  @ApiProperty({ description: 'Preferred currency', required: false })
  @IsOptional()
  @IsString()
  readonly currency: string;

  @ApiProperty({ description: 'Preferred area unit', required: false })
  @IsOptional()
  @IsString()
  readonly areaUnit: string;
}
