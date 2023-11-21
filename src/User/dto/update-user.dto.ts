/* eslint-disable prettier/prettier */
// src/user/dto/update-user.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail,  IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    readonly firstName: string;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    readonly lastName: string;

    @ApiProperty({ type: String })
    @IsEmail({}, { message: 'Invalid email format' })
    readonly email: string;

    @ApiProperty({ type: String })
    @IsString({ message: 'Mobile number must be a string' })
    readonly mobileNumber: string;

    @ApiProperty({ type: String, required: false })
    @IsString({ message: 'Landline number must be a string' })
    @IsOptional()
    readonly landlineNumber?: string;

    @ApiProperty({ type: String })
    @IsString({ message: 'Country  must be a string' })
    readonly country: string;

    @ApiProperty({ type: String })
    @IsString({ message: ' address must be a string' })
    readonly Address: string;



    @ApiProperty({ type: String })
    @IsString({ message: 'Profile image must be a string' })
    readonly profileImage: string;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    readonly oldPassword: string;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    readonly password: string;
}
