import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { Workbook, stream } from 'exceljs';
import * as tmp from 'tmp';
import { writeFile } from 'fs/promises';
import { promises } from 'dns';
import { rejects } from 'assert';

import { Goods } from './entities/goods.entity';
import { DatatableDTO } from 'src/outlet/dto/Outletdatatable.dto';
import { Outlet } from 'src/outlet/entities/Outlet.entity';
import { GoodsDto } from './dto/goods.dto';


@Injectable()
export class GoodsService {

  constructor(
    @InjectRepository(Goods)
    private GoodsRepository: Repository<Goods>,
    @InjectRepository(Outlet)
    private OutletRepository: Repository<Outlet>,
  ){}
  
 async create(dto: GoodsDto) {
    await this.GoodsRepository.save(dto)

    return dto;
 }

 async findAllOutletAsset(dto:DatatableDTO) {

  let param={};
  const limit=dto.limit  && +dto.limit > 0  ? dto.limit   : 10;
  const skip=dto.skip  && +dto.skip >= 0  ? dto.skip   : 0;

  const sortType=['DESC','ASC'];

  param['take']=limit;
  param['skip']=skip;
  param['order']={};
  param['where']={};


  for(let dt in dto.data){
     
    if(dt){
        param['where'][dt]=Like(`%${dto.data[dt]}%`)
      }
  }

  param['relations']=['goods'];
  const [data, total]= await this.OutletRepository.findAndCount(param);

  for(const dtOutlet of data){
    dtOutlet['AssetTotal']=dtOutlet.goods.length;
  }


  return {
    data: data,
    total: total,
    limit: +limit,
    skip: +skip
  };

}

  async findAll(dto:DatatableDTO) {

    let param={};
    const limit=dto.limit  && +dto.limit > 0  ? dto.limit   : 10;
    const skip=dto.skip  && +dto.skip >= 0  ? dto.skip   : 0;

    const sortType=['DESC','ASC'];

    param['take']=limit;
    param['skip']=skip;
    param['order']={};
    param['where']={};


    for(let dt in dto.data){
       
      if(dt){
          param['where'][dt]=Like(`%${dto.data[dt]}%`)
        }
    }

  
    const [data, total]= await this.GoodsRepository.findAndCount(param);
 
    return {
      data: data,
      total: total,
      limit: +limit,
      skip: +skip
    };

  }

  async findOne(id: number) {
    const data= await this.GoodsRepository.findOne({where:{
      id:id,} 
    })

    if(!data) throw new NotFoundException();

    return data;
  }


 async update(id: number, dto: GoodsDto) {
    //throw error when not exist
    const params={};

    await this.findOne(id)
    
 
    params['GoodsName']=dto.GoodsName;
    params['GoodsType']=dto.GoodsType;
    params['Specification']=dto.Specification;
   
    await this.GoodsRepository.update({id:id},params)

    const result=  await this.findOne(id)
    return result;
  }

  async remove(id: number) {
   //throw error when not exist
   await this.findOne(id)

    await this.GoodsRepository.delete(id);
    
    return {
      message:"deleted successfully"
    }
  }

  generateParam(param:string){

    const data={
      OrderByAuthor:'Author',
      OrderByTitle:'Title',
      OrderByAyod:'Ayod',
      OrderByTags:'Tags',
      OrderByPublisher:'Publisher'
    }

    const result=data[param] ? data[param]:'';

    return result;
  }




  async findAllGoods(filter: any={}){

    const data=await this.GoodsRepository.find(filter);

    return data;
  }

  
  async findAllGoodsDatatable(dto:DatatableDTO) {

    let param={};
    const limit=dto.limit  && +dto.limit > 0  ? dto.limit   : 10;
    const skip=dto.skip  && +dto.skip >= 0  ? dto.skip   : 0;
  
    const sortType=['DESC','ASC'];
  
    param['take']=limit;
    param['skip']=skip;
    param['order']={};
    param['where']={};
  
  
    for(let dt in dto.data){
       
      if(dt){
          param['where'][dt]=Like(`%${dto.data[dt]}%`)
        }
    }
  
 
    const [data, total]= await this.GoodsRepository.findAndCount(param);
  
    return {
      data: data,
      total: total,
      limit: +limit,
      skip: +skip
    };
  
  }


  async downloadTemplateAsset(){
    const data= await this.findAllGoods({where:{GoodsType:'ASSET'}})
  
    let book= new Workbook();

    let worksheet = book.addWorksheet(`sheet1`);
    const headerRow = worksheet.getRow(1);
    headerRow.getCell(1).value = 'GoodsName';
    headerRow.getCell(2).value = 'Specification';
    headerRow.getCell(3).value = 'Qty';
  

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0000' }, // Specify your desired color code here
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' }, // Specify your desired color code here
      };
    });

    // Write data to the worksheet
    data.forEach((row, index) => {
      
      worksheet.getCell(`A${index + 2}`).value = row.GoodsName;
      worksheet.getCell(`B${index + 2}`).value = row.Specification;
      worksheet.getCell(`C${index + 2}`).value = 0;
     
      // Add more columns as needed
    });

   

// write to a new buffer
    const buffer = await book.xlsx.writeBuffer();
    
    return buffer
  }

  async downloadTemplateInventory(){
    const data= await this.findAllGoods({where:{GoodsType:'INVENTORY'}})
  
    let book= new Workbook();

    let worksheet = book.addWorksheet(`sheet1`);
    const headerRow = worksheet.getRow(1);
    headerRow.getCell(1).value = 'GoodsName';
    headerRow.getCell(2).value = 'Specification';
    headerRow.getCell(3).value = 'Qty';
  

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0000' }, // Specify your desired color code here
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' }, // Specify your desired color code here
      };
    });

    // Write data to the worksheet
    data.forEach((row, index) => {
      
      worksheet.getCell(`A${index + 2}`).value = row.GoodsName;
      worksheet.getCell(`B${index + 2}`).value = row.Specification;
      worksheet.getCell(`C${index + 2}`).value = 0;
     
      // Add more columns as needed
    });

   

// write to a new buffer
    const buffer = await book.xlsx.writeBuffer();
    
    return buffer
  }

 
 
}
