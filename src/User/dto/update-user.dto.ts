/* eslint-disable prettier/prettier */
// src/user/dto/update-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({ type: String })
    @IsString({ message: 'First name must be a string' })
    @IsOptional()

    readonly first_name: string;

    @ApiProperty({ type: String })
    @IsString({ message: 'Last name must be a string' })
    @IsOptional()

    readonly last_name: string;

    @ApiProperty({ type: String })
    @IsEmail({}, { message: 'Invalid email format' })
    @IsOptional()

    readonly email: string;

    @ApiProperty({ type: String })
    @IsString({ message: 'Mobile number must be a string' })
    @IsOptional()

    readonly mobile_number: string;

    @ApiProperty({ type: String, required: false })
    @IsString({ message: 'Landline number must be a string' })
    @IsOptional()

    @IsOptional()
    readonly landline_number?: string;

    @ApiProperty({ type: String, required: false })
    @IsString({ message: 'Whatsapp number must be a string' })
    @IsOptional()

    @IsOptional()
    readonly whatsapp?: string;

    @ApiProperty({ type: String })
    @IsString({ message: 'Country  must be a string' })
    @IsOptional()

    readonly country?: string;

    @ApiProperty({ type: String })
    @IsString({ message: ' address must be a string' })
    @IsOptional()

    readonly address?: string;


    @ApiProperty({ type: String })
    @IsString({ message: 'Profile image must be a string' })
    @IsOptional()

    readonly profile_image: string;

    @ApiProperty({ type: String })
    @IsString({ message: 'Role must be a string' })
    @IsOptional()

    readonly role: string;

    @ApiProperty({ type: String })
    @IsString({ message: 'Social id must be a string' })
    @IsOptional()

    readonly social_id: string;

    @ApiProperty({ type: Boolean, default: false })
    @IsBoolean({ message: 'Verified must be a Bool' })
    @IsOptional()

    readonly isVerified: boolean;

    @ApiProperty({ type: Boolean, default: false })
    @IsBoolean({ message: 'profile visibility must be a Bool' })
    @IsOptional()

    readonly profile_visibility: boolean;

   

    readonly updated_at: Date;
}
