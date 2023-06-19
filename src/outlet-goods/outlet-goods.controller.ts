import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res, Header, Req } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiFoundResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiProperty, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';
import { dateMoment } from '../helpers/date.helper';
import { Config } from 'src/helpers/config.helper';
import { response, responseError } from 'src/helpers/response.helper';
import { GoodsDto } from './dto/goods.dto';
import { DatatableDTO } from 'src/outlet/dto/Outletdatatable.dto';
import { GoodsService } from './outlet-goods.service';

@ApiTags('Outlets-goods')
@Controller('api/v1/Outlets-goods')
export class GoodsController {
  constructor(private readonly GoodsService: GoodsService) {}

  @Post()
  create(@Body() dto: GoodsDto) {
    return this.GoodsService.create(dto);
  }

  @Post('datatable')
  findAllOutletAsset(@Body() dto: DatatableDTO) {
    return this.GoodsService.findAllOutletAsset(dto);
  }

  @Get('detail/:id')
  findOne(@Param('id') id: number) {
    return this.GoodsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: GoodsDto) {
    return this.GoodsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.GoodsService.remove(id);
  }

  @Post('Goods')
  findAllGoods(@Body() dto: any) {
    let data:any={};
    
    if(dto.GoodsType){
      data=this.GoodsService.findAllGoods({where:{GoodsType:dto.GoodsType}});
    }else{
       data=this.GoodsService.findAllGoods();
    }

    return data;
  }

  @Post('Goods/datatable')
  findAllGoodsDatatable(@Body() dto: DatatableDTO) {
    return this.GoodsService.findAllGoodsDatatable(dto);
  }

  @Get('download-template-asset')
    async downloadTemplateAsset(@Req() req: any) {
        try {
            const url = `${Config.get('BASE_URL')}api/v1/Outlets-goods/export-template-asset`;
            return url;
        } catch (error) {
            
        }
  }

  @Get('export-template-asset')
  async exportTemplateAsset( @Res() res: any) {
        const getBuffer = await this.GoodsService.downloadTemplateAsset();
        const currDate = dateMoment().format('YYMMDDHHmmss');
        res.setHeader('Content-disposition', `attachment;filename=list-asset_${currDate}.xlsx`);
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.status(200);
        res.send(getBuffer);
        return response('success', `list-asset_${currDate}.xlsx`);
  }

  @Get('download-template-inventory')
  async downloadTemplateInventory(@Req() req: any) {
      try {
          const url = `${Config.get('BASE_URL')}api/v1/Outlets-goods/export-template-inventory`;
          return url;
      } catch (error) {
          
      }
  }

  @Get('export-template-inventory')
  async exportTemplateInventory( @Res() res: any) {

        const getBuffer = await this.GoodsService.downloadTemplateInventory();
        const currDate = dateMoment().format('YYMMDDHHmmss');
        res.setHeader('Content-disposition', `attachment;filename=list-inventory_${currDate}.xlsx`);
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.status(200);
        res.send(getBuffer);
        return response('success', `list-asset_${currDate}.xlsx`);
  
  }

  @Post('import-template-asset')
  async importTemplateAsset(@Req() req: any, @Body() dto: any) {
      try {

          const data = await this.GoodsService.importTemplateAsset(dto);
        console.log(data,'data')
          return response('success', data);
      } catch (error) {
          return responseError(error.message);
      }
  }

  @Post('import-template-inventory')
  async importTemplateInventory(@Req() req: any, @Body() dto: any) {
      try {

          const data = await this.GoodsService.importTemplateInventory(dto);

          return response('success', data);
      } catch (error) {
          return responseError(error.message);
      }
  }

  @Post('createoutletgoods')
  async createOutletGoods(@Req() req: any, @Body() dto: any) {
      try {

          const data = await this.GoodsService.createOutletGoods(dto);

          return response('success', data);
      } catch (error) {
          return responseError(error.message);
      }
  }

  @Post('generatecodeasset')
  async generateCodeAsset(@Body() dto: any){
    const data = await this.GoodsService.generateCodeAsset(dto);
    return data;
  }

  
  
}
