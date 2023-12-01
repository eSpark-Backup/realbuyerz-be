/* eslint-disable prettier/prettier */

import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


/* eslint-disable prettier/prettier */
export class LinkEmailDto {
    @ApiProperty({ type: String })
    @IsEmail()
    to: string;

}