import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiFoundResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiProperty, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OutletsService } from './outlet.service';
import { OutletDto } from './dto/Outlet.dto';
import {  OutletDatatableDTO, ResponseOutletDatatable } from './dto/Outletdatatable.dto';
import { Outlet } from './entities/Outlet.entity';

@ApiTags('Outlets')
@Controller('api/v1/Outlets')
export class OutletsController {
  constructor(private readonly OutletsService: OutletsService) {}

  
  
  @ApiOperation({
    summary:'Create Outlet'
  })
  @Post()
  @ApiBadRequestResponse({    
    description: 'Bad Request',
    schema:{
      type:'object',
      example:{
        
          statusCode: 400,
          message: [
            "Publisher should not be empty",
            "Publisher must be a string"
          ],
          error: "Bad Request"
        
      }
    }
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Outlet,
  })
  create(@Body() dto: OutletDto) {
    return this.OutletsService.create(dto);
  }



   
  @ApiOperation({
    summary:'Get pagination Outlet'
  })
  @Get()
  @ApiOkResponse({
    type:ResponseOutletDatatable
  })
  findAll(@Query() query: OutletDatatableDTO) {
    return this.OutletsService.findAll(query);
  }


     
  @ApiOperation({
    summary:'Get 1 detail Outlet'
  })
  @ApiNotFoundResponse({    
    description: 'Outlet was Not Found',
    schema:{
      type:'object',
      example:{
        statusCode:404,
        message:"Not Found"
      }
    }
  })
  @ApiOkResponse({
    type:Outlet
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.OutletsService.findOne(id);
  }


   
  @ApiOperation({
    summary:'Update Outlet'
  })
  @ApiNotFoundResponse({    
    description: 'Outlet was Not Found',
    schema:{
      type:'object',
      example:{
        statusCode:404,
        message:"Not Found"
      }
    }
  })
  @ApiOkResponse({
    type:Outlet
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: OutletDto) {
    return this.OutletsService.update(id, dto);
  }




  @ApiOperation({
    summary:'Delete Outlet, fisrt fill authorizations with token, to get token example, you can generate Auth Api'
  })
  @ApiNotFoundResponse({    
    description: 'Outlet was Not Found',
    schema:{
      type:'object',
      example:{
        statusCode:404,
        message:"Not Found"
      }
    }
  })
  @ApiUnauthorizedResponse({    
    description: 'Unauthorized',
    schema:{
      type:'object',
      example:{
        statusCode:401,
        message:"Unauthorized"
      }
    }
  })
  @ApiOkResponse({
    schema:{
      type:'object',
      example:{
        message:'deleted successfully'
      }
    }
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.OutletsService.remove(id);
  }
}
