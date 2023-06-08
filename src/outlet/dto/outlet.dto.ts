import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {ArrayNotEmpty, IsArray, IsDefined, IsIn, isIn, IsNotEmpty, IsNotIn, IsNumber, IsString, MaxLength} from "class-validator";
export class OutletDto {
   
    @ApiProperty({
        maxLength:255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    Am:string;

    @ApiProperty({
        maxLength:255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    Drm:string;

    @ApiProperty({
        maxLength:255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    CodeOutlet:string;

    @ApiProperty({
        maxLength:255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    OutletName:string;

    @ApiProperty({
        maxLength:255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    Address:string;

    @ApiProperty({
        maxLength:255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    Ownership:string;

    @ApiProperty({
        maxLength:255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    DistrictArea:string;


    @ApiProperty({
        maxLength:255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    OutletType:string;

    @ApiProperty({
        maxLength:255
    })
    @IsString()
    @MaxLength(255)
    OutletMallType:string;

    @ApiProperty({
        maxLength:255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    OutletStatus:string;

    @ApiProperty()
    @IsArray()
    Employee:any[];
}


export class OutletFilter {
    @ApiPropertyOptional()
    Author:string;

    @ApiPropertyOptional()

    Title:string;

    @ApiPropertyOptional()
    Ayod:number;

    @ApiPropertyOptional()
    Tags:string;

    @ApiPropertyOptional()
    Publisher:string;
}


export class OutletOrderBy {
    @ApiPropertyOptional({
        enum:['ASC','DESC']
    })
    OrderByAuthor:string;

    @ApiPropertyOptional({
        enum:['ASC','DESC']
    })
    OrderByTitle:string;

    @ApiPropertyOptional({
        enum:['ASC','DESC']
    })
    OrderByAyod:string;

    @ApiPropertyOptional({
        enum:['ASC','DESC']
    })
    OrderByTags:string;

    @ApiPropertyOptional({
        enum:['ASC','DESC']
    })
    OrderByPublisher:string;



}



