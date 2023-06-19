import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {ArrayNotEmpty, IsArray, IsDefined, IsIn, isIn, IsNotEmpty, IsNotIn, IsNumber, IsString, MaxLength} from "class-validator";
export class GoodsOutletDto {

    @ApiProperty()
    @IsNotEmpty()
    OutletId: number;

    @ApiProperty()
    @IsNotEmpty()
    GoodsId: number;
  
    @ApiProperty({
        maxLength:255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    AssetId: string;

    @ApiProperty({
        maxLength:255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    GoodsName:string;

    @ApiProperty({
        maxLength:255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    GoodsType :string;

    @ApiProperty({
        maxLength:255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    Specification :string;

  
    Qty:number;

    @ApiProperty()
    @IsArray()
    Asset:any[];

    @ApiProperty()
    @IsArray()
    Inventory:any[];
}