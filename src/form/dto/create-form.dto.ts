import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateFormDto {

    // @IsNumber()
    id: number;

    @IsString()
    Tittle: string;

    @IsString()
    Remarks: string;

    // @IsString()
    RequiredTime: Date;

    // @IsNumber()
    IsActive:number;

    @ApiProperty()
    @IsArray()
    Questions:QuestionsFormDto[];

}

export class QuestionsFormDto {

    id:number;
    
    @IsString()
    QuestionName: string;

    @IsString()
    QuestionType: string;

    @IsString()
    IsRequired: number;

    @ApiProperty()
    @IsArray()
    Options:OptionsFormDto[];
    
}


export class OptionsFormDto {

    @IsString()
    label: string;

    @IsString()
    value: string;
    
}
