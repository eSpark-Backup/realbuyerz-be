/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/* eslint-disable prettier/prettier */
export class getBidDTO {

    @ApiProperty({ type: String, example: 1 })
    @IsNotEmpty({ message: 'Bidding ID cannot be empty' })
    readonly user_property_id: string;
  }
  