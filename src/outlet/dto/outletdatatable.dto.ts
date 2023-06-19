import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmpty, IsIn, IsInt, IsOptional, Max, ValidateNested} from "class-validator";
import { Transform } from 'class-transformer';
import { OutletFilter, OutletOrderBy } from "./Outlet.dto";
import { empty } from "rxjs";
import { Outlet } from "../entities/Outlet.entity";

export class DatatableDTO {
    
    @ApiPropertyOptional({
        description: 'Limit data to show',
        default: 10,
        maximum:100,
    })
    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    @IsInt()
    @Max(100)
    limit: number;

    @Transform(({ value }) => parseInt(value))
    @ApiPropertyOptional({
        description: 'Start at number of row',
        default: 0,
        minimum:0,
    })
    skip: number;

    @ApiPropertyOptional({
        description: 'Order By Field',
        default: ''
    })
    orderBy: any;


    @ApiPropertyOptional({
        description: 'Field to filter',
        default: ''
    })
    @IsOptional()
    filter:any;

    data: any;

}

export class ResponseOutletDatatable {
    @ApiProperty()
    data:Outlet;

    @ApiProperty()
    count:number;

    @ApiProperty()
    limit:number;

    @ApiProperty()
    skip:number;
}






