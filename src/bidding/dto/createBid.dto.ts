/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateBidDto {


    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
        },
        example: ['Property_id1', 'Property_id1', 'Property_id1', 'Property_id1', 'Property_id1'],
        required: true,
    })
    @IsNotEmpty({ message: 'At least one property id is required' })
    readonly agent_property_id: any[];

    @ApiProperty({ type: String, example: 1 })
    @IsNotEmpty({ message: 'User Property ID cannot be empty' })
    readonly user_property_id: any;



}
