/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ type: String, example: 'Basic' , description: 'Subscription type' })
  @IsString({ message: 'Subscription name must be a string' })
  @IsNotEmpty({ message: 'Subscription name cannot be empty' })
  readonly name: string;

    @ApiProperty({ type: Number, example: 500, description: 'Subscription price' })
    @IsInt({ message: 'Subscription price must be a number' })
    @IsNotEmpty({ message: 'Subscription price cannot be empty' })
    readonly price: number;

    @ApiProperty({ type: Number, example: 30, description: 'Number of Listing' })
    @IsInt({ message: 'Number of Listing must be a number' })
    @IsNotEmpty({ message: 'Number of Listing cannot be empty' })
    readonly listing: number;

    @ApiProperty({ type: Number, example: 30, description: 'Number of Connects' })
    @IsInt({ message: 'Number of Connects must be a number' })
    @IsNotEmpty({ message: 'Number of Connects cannot be empty' })
    readonly connects: number;

    @ApiProperty({ type: String, example: 30, description: 'Description of Subscription' })
    readonly description: string;
}
