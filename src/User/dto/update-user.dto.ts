/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// src/user/dto/update-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsBooleanString, IsEmail, IsEnum, IsOptional, IsString, isBoolean } from 'class-validator';
// enum UserRole {
//     agent = 'agent',
//     user = 'user',
//     // Add other roles as needed
// }

export class UpdateUserDto {
    @ApiProperty({ type: String, required: false })
    @IsString({ message: 'First name must be a string' })
    @IsOptional()
    readonly first_name: string;

    @ApiProperty({ type: String, required: false })
    @IsString({ message: 'Last name must be a string' })
    @IsOptional()
    readonly last_name: string;

    @ApiProperty({ type: String,default:'ahsan@mail.com'})
    @IsEmail({}, { message: 'Invalid email format' })
    @IsOptional()

    readonly email: string;

    @ApiProperty({ type: String, required: false })
    @IsString({ message: 'Mobile number must be a string' })
    @IsOptional()

    readonly mobile_number: string;

    @ApiProperty({ type: String, required: false })
    @IsString({ message: 'Landline number must be a string' })
    @IsOptional()
    readonly landline_number?: string;

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
    readonly profile_image: string;

    // @ApiProperty({ enum: UserRole, required: false })
    // @IsEnum(UserRole, { message: 'Invalid role' })
    // @IsOptional()
    // readonly role: UserRole;

    @ApiProperty({ type: String, required: false })
    @IsString({ message: 'Social id must be a string' })
    @IsOptional()
    readonly social_id: string;

    @ApiProperty({ type: Boolean, default: false, required: false })
    @IsOptional()
    readonly isVerified: boolean;

    @ApiProperty({ type: Boolean, default: false, required: false })
    @IsOptional()
    readonly profile_visibility: boolean;


    readonly updated_at: Date;

    @ApiProperty({ type: 'string', format: 'binary', example: 'image1.jpg', required: false })
    @IsOptional()
    readonly image: [];
}
