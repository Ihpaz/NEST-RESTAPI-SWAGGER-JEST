import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { retry } from 'rxjs';
import { responseError } from 'src/helpers/response.helper';
import { DatatableDTO } from 'src/outlet/dto/Outletdatatable.dto';

@Controller('Api/v1/form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  async create(@Body() createFormDto: CreateFormDto) {
    try {
      const data= await this.formService.create(createFormDto);
      return data;
    } catch (error) {
      responseError(error.message)
    }
  }

  @Post('datatable')
  async findAll(@Body() dto: DatatableDTO) {
    try {
      const data= await this.formService.findAll(dto);
      return data;
    } catch (error) {
      responseError(error.message)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data= await this.formService.findOne(+id);
      return data;
    } catch (error) {
      responseError(error.message)
    }
  }



  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const data= await this.formService.remove(+id);
      return data;
    } catch (error) {
      responseError(error.message)
    }
  }
}
