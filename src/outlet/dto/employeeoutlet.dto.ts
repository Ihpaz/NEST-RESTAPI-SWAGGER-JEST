import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {ArrayNotEmpty, IsArray, IsDefined, IsIn, isIn, IsNotEmpty, IsNotIn, IsNumber, IsString, MaxLength} from "class-validator";

export class OutletDto {
   
   

    @ApiProperty({
        maxLength:255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    CodeOutlet:string;

    @ApiProperty()
    @IsNotEmpty()
    OutletId:number;

    @ApiProperty()
    @IsArray()
    @ArrayNotEmpty()
    Employee:any[];



}