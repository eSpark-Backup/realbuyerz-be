/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString,  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class VerifyEmailLinkDto{
 
    @ApiProperty({ description: 'Token received during Email Send generation' })
    @IsNotEmpty()
    @IsString()
    readonly token: string;
}