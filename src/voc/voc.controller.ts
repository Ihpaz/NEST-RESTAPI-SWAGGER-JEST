import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, Query } from '@nestjs/common';
import { VocService } from './voc.service';
import { CreateVocDto } from './dto/create-voc.dto';
import { UpdateVocDto } from './dto/update-voc.dto';
import { dateMoment } from 'src/helpers/date.helper';
import { response, responseError } from 'src/helpers/response.helper';
import { Config } from 'src/helpers/config.helper';
import { DatatableDTO } from 'src/outlet/dto/Outletdatatable.dto';
import { UpdateVocNegatifDto } from './dto/update-voc-negatif.dto';
import { FilterGrafikVoc } from './dto/filter-grafik-voc.dto';
import { PdfService } from 'src/general/pdf.service';

@Controller('Api/v1/voc')
export class VocController {
  constructor(
    private readonly vocService: VocService,
    private _pdfService: PdfService,
  
    ) {}

  @Post()
  create(@Body() createVocDto: CreateVocDto) {
    return this.vocService.create(createVocDto);
  }

  @Post('datatable')
  findAllDattaatable(@Body() dto: DatatableDTO) {
    return this.vocService.findAll(dto);
  }

  @Post('negatif/datatable')
  findAllVocNegatif(@Body() dto: DatatableDTO) {
    return this.vocService.findAllVocNegatif(dto);
  }

  // @Get('negatif/:id')
  // findOneVocNegatif(@Param('id') id: number) {
  //   return this.vocService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVocDto: UpdateVocDto) {
  //   return this.vocService.update(+id, updateVocDto);
  // }

  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    try {
      const result= await this.vocService.removeVoc(+id);
      return result;
    } catch (error) {
      return responseError(error.message);
    }
  }

  @Get('export-template-voc')
  async exportTemplateVoc( @Res() res: any) {
        const getBuffer = await this.vocService.downloadTemplateVOC();
        const currDate = dateMoment().format('YYMMDDHHmmss');
        res.setHeader('Content-disposition', `attachment;filename=voc_${currDate}.xlsx`);
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.status(200);
        res.send(getBuffer);
        return response('success', `VOC_${currDate}.xlsx`);
  }

  @Get('download-template-voc')
  async downloadTemplateVoc(@Req() req: any) {
      try {
          const url = `${Config.get('BASE_URL')}Api/v1/voc/export-template-voc`;
          return url;
      } catch (error) {
          
      }
  }

  @Post('import-template-voc')
  async importTemplateVoc(@Req() req: any, @Body() dto: any) {
      try {
          const data = await this.vocService.importTemplateVOC(dto);
          return response('success', data);
      } catch (error) {
          return responseError(error.message);
      }
  }

  @Patch('vocnegatif/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateVocNegatifDto) {
    try {
      const result= await this.vocService.updateVocNegatif(+id, dto);
      return result;
    } catch (error) {
      return responseError(error.message);
    }
  }


  @Get('create/negatifcategory')
  createnegatifcategory() {
    return this.vocService.createVocNegatifCategory();
  }

  @Post('dashboard-vocbar-ByMonth')
  async getDashboardVocBarByMonth(@Req() req: any, @Body() dto: FilterGrafikVoc) {
      try {
          const data = await this.vocService.getDashboardVocBarByMonth(dto);
          return response('success', data);
      } catch (error) {
          return responseError(error.message);
      }
  }

  
  @Post('get-dashboardvocrank-byoutlet/datatable')
  getDashboardVocRankByOutlet(@Body() dto: DatatableDTO) {
    return this.vocService.getDashboardVocRankByOutlet(dto);
  }

  @Get('url-download-voarank')
  async generateUrl(@Query() query: any) {
      try {
       
        console.log(query,'queryawl')

          let urln: string = `${Config.get('BASE_URL')}Api/v1/voc/download-voa-rank?`;
         

          // console.log(params,'param')
          for(const key in query){
              urln+=`${key}=${query[key]}&`;
          }
          return response('success', urln);

      } catch (error) {
          return responseError(error.message);
      }
  }

  @Get('download-voa-rank')
  async downloadBT(@Req() req: any, @Res() res: any, @Query() query: any) {
      try {

          const data =  await this.vocService.getRequestVocRankForPdf(query);
          const buffer = await this._pdfService.generatePDFNew('voc-rank', data, { landscape: false });
          const timeNow = dateMoment().format('HHmm');
          const filename = `voc-rank_${timeNow}.pdf`
          res.setHeader('Content-disposition', `attachment;filename=${filename}`);
          res.set('Content-Type', 'application/pdf');
          res.status(200);
          res.send(Buffer.from(buffer));
      } catch (error) {
          return responseError(error.message);
      }
  }

  @Post('get-dashboardvoc-bycategory-daytoday/datatable')
  getDashboardVocBYCategoryDaytoDay(@Body() dto: DatatableDTO) {
    return this.vocService.getDashboardVocBYCategoryDaytoDay(dto);
  }
  
}


