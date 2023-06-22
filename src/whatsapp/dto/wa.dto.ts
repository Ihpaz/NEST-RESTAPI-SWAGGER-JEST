import { ApiProperty } from "@nestjs/swagger";

export class WaDto{
    @ApiProperty({
        maxLength:255
    })
    number: string;

    @ApiProperty({
        maxLength:255
    })
    message: string;
}