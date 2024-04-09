/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

/* eslint-disable prettier/prettier */
export class PropertyDataDTO{



    @ApiProperty({ type: Object, example: 1 })
   readonly propertyId: any;

    @ApiProperty({ type: String, example: 1 })
   readonly url: string;
   
   
    @ApiProperty({ type: String, example: 1 })
   readonly type: string;
    
}
    


