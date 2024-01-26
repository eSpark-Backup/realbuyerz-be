/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/* eslint-disable prettier/prettier */
export class updateProposalDTO{



    
    @ApiProperty({ type: String, example: 1 })
    @IsNotEmpty({ message: 'User Property ID cannot be empty' })
    readonly user_property_id: any;

    @ApiProperty({ type: String, example: 1 })
    @IsNotEmpty({ message: 'User Property ID cannot be empty' })
    readonly agent_property_id: any;
}