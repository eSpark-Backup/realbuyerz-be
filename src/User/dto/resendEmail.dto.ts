import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class resendEmailDto {
  @ApiProperty({ type: String, description: 'email required' })
  @IsEmail()
  email: string;
}
