import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, getConnection, getConnectionManager } from 'typeorm';
import { Workbook, stream } from 'exceljs';
import { Goods } from './entities/goods.entity';
import { DatatableDTO } from 'src/outlet/dto/Outletdatatable.dto';
import { Outlet } from 'src/outlet/entities/Outlet.entity';
import { GoodsDto } from './dto/goods.dto';
import { Config } from 'src/helpers/config.helper';
import { join } from 'path';
import { createAutoNumber } from 'src/helpers/generate.helper';
import { GoodsOutlet } from './entities/goodsoutlet.entity';
import { GoodsOutletDto } from './dto/goodsoutlet.dto';
import { QueryHelper } from 'src/helpers/query.helper';


@Injectable()
export class GoodsService {

  constructor(
    @InjectRepository(Goods)
    private GoodsRepository: Repository<Goods>,
    @InjectRepository(Outlet)
    private OutletRepository: Repository<Outlet>,
    @InjectRepository(GoodsOutlet)
    private GoodsOutletRepository: Repository<GoodsOutlet>,
    private _queryHelper:QueryHelper,
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

  param['relations']=['goodsOutlet'];
  const [data, total]= await this.OutletRepository.findAndCount(param);

  for(const dtOutlet of data){
    dtOutlet['AssetTotal']=dtOutlet.goodsOutlet.length;
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
    });

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
    console.log(filter,'data')
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
    headerRow.getCell(1).value = 'GoodsId';
    headerRow.getCell(2).value = 'GoodsName';
    headerRow.getCell(3).value = 'Specification';
    headerRow.getCell(4).value = 'Qty';
  
    

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

      worksheet.getCell(`A${index + 2}`).value = row.id;
      worksheet.getCell(`B${index + 2}`).value = row.GoodsName;
      worksheet.getCell(`C${index + 2}`).value = row.Specification;
      worksheet.getCell(`D${index + 2}`).value = 0;
     
      // Add more columns as needed
    });

    

    worksheet.protect('sevenretail123',{selectLockedCells:true,formatCells:true,formatColumns:true});

    const column = worksheet.getColumn(4);
    column.eachCell((cell) => {
      cell.protection = {
        locked: false
      };
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
    headerRow.getCell(1).value = 'GoodsId';
    headerRow.getCell(2).value = 'GoodsName';
    headerRow.getCell(3).value = 'Specification';
    headerRow.getCell(4).value = 'Qty';
  
  

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
      
      worksheet.getCell(`A${index + 2}`).value = row.id;
      worksheet.getCell(`B${index + 2}`).value = row.GoodsName;
      worksheet.getCell(`C${index + 2}`).value = row.Specification;
      worksheet.getCell(`D${index + 2}`).value = 0;
     
    });

    worksheet.protect('sevenretail123',{selectLockedCells:true,formatCells:true,formatColumns:true});

    const column = worksheet.getColumn(4);
    column.eachCell((cell) => {
      cell.protection = {
        locked: false
      };
    });
    
    // write to a new buffer
    const buffer = await book.xlsx.writeBuffer();
    
    return buffer
  }

  async importTemplateAsset(dto:any){

    const resultImport: any = {};
          resultImport['Result'] = [];
    
    const workbook = new Workbook();
    const pathRaw = join(`${Config.get('FOLDER_UPLOAD')}${Config.get('TEMP_RAW_PATH_FILE')}/`, dto.Attachment);

   await workbook.xlsx.readFile(pathRaw)
    .then(() => {
      // Excel file loaded successfully
      const worksheet = workbook.getWorksheet(1); // Get the first worksheet

  
      for (let i = 2; i <= worksheet.rowCount; i++) {

          const Id=worksheet.getCell(`A${i}`).value;
          const GoodsName=worksheet.getCell(`B${i}`).value;
          const Specification=worksheet.getCell(`C${i}`).value;
          const Qty=worksheet.getCell(`D${i}`).value;

          for (let x = 1; x <= Number.parseInt(Qty.toString()); x++) {
            const singleResult: any = {};
          
            const autonumber= createAutoNumber(x);
           
            singleResult['GoodsId'] = Id;
            singleResult['GoodsName'] = GoodsName;
            singleResult['Specification'] = Specification;
            singleResult['AssetId'] = `${GoodsName}-${dto.CodeOutlet}-${autonumber}`;
            resultImport['Result'].push(singleResult);
            
          }

         
      }

    
     
    })
    .catch((error) => {
      // Error occurred while loading the Excel file
      console.log('Error:', error);
    });
    
    return resultImport;
  }

  async importTemplateInventory(dto:any){

    const resultImport: any = {};
          resultImport['Result'] = [];
    
    const workbook = new Workbook();
    const pathRaw = join(`${Config.get('FOLDER_UPLOAD')}${Config.get('TEMP_RAW_PATH_FILE')}/`, dto.Attachment);

    await workbook.xlsx.readFile(pathRaw)
      .then(() => {
        // Excel file loaded successfully
        const worksheet = workbook.getWorksheet(1); // Get the first worksheet

    
        for (let i = 2; i <= worksheet.rowCount; i++) {
            const singleResult: any = {};

            const Id=worksheet.getCell(`A${i}`).value;
            const GoodsName=worksheet.getCell(`B${i}`).value;
            const Specification=worksheet.getCell(`C${i}`).value;
            const Qty=worksheet.getCell(`D${i}`).value;

          
            if(Qty==0){
              break;
            }else{
              singleResult['GoodsId'] = Id;
              singleResult['GoodsName'] = GoodsName;
              singleResult['Specification'] = Specification;
              singleResult['Qty'] = Qty;
              resultImport['Result'].push(singleResult);
            }
          
        }
      
      })
      .catch((error) => {
        // Error occurred while loading the Excel file
        console.log('Error:', error);
    });
    
    return resultImport;
  }

  async createOutletGoods(dto:GoodsOutletDto){
    const queryRunner = this._queryHelper.queryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
       
      console.log(dto,'goods')
        if(dto.Asset){
          await queryRunner.manager.delete('GoodsOutlet',{OutletId:dto.OutletId,GoodsType:'ASSET'});
          for(const dt of dto.Asset){
           
  
            const params={};
            params['OutletId']=dto.OutletId;
            params['GoodsId']=dt.GoodsId;
            params['GoodsName']=dt.GoodsName;
            params['Specification']=dt.Specification;
            params['AssetId']=dt.AssetId;
            params['GoodsType']='ASSET';
           
            await queryRunner.manager.save('GoodsOutlet',params);
          }
        }
        
        if(dto.Inventory){
          await queryRunner.manager.delete('GoodsOutlet',{OutletId:dto.OutletId,GoodsType:'INVENTORY'});
          for(const dti of dto.Inventory){
           

            const params={};
            params['OutletId']=dto.OutletId;
            params['AssetId']=0;
            params['GoodsId']=dti.GoodsId;
            params['GoodsName']=dti.GoodsName;
            params['Specification']=dti.Specification;
            params['Qty']=dti.Qty;
            params['GoodsType']='INVENTORY';
            await queryRunner.manager.save('GoodsOutlet',params);
          }
       }
       
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new Error(error.message);
    } finally {
        await queryRunner.release();
    }
  }

  async generateCodeAsset(dto:any){

    const result: any = {};
    result['Asset'] = [];
    let prefix:string='';

    const data= await this._queryHelper.getOne(`
      SELECT 
        RIGHT(AssetID, 3)  AS AssetPrefix
      FROM goods_outlet
      WHERE 
          OutletId=:OutletId AND
          GoodsId=:GoodsId
      ORDER BY RIGHT(AssetID, 3) DESC
    `,{
      OutletId:dto.OutletId,
      GoodsId:dto.GoodsId
    });
 
    for(let x=1;x <= dto.Qty;x++){

      if(!data){
         prefix=createAutoNumber(x);
      }else{
         prefix=createAutoNumber(parseInt(data.AssetPrefix));
      }

      const params={};
      

      params['CodeOutlet']=dto.CodeOutlet;
      params['AssetId']=`${dto.GoodsName}-${dto.CodeOutlet}-${prefix}`;
      params['GoodsId']=dto.GoodsId;
      params['GoodsName']=dto.GoodsName;
      params['Specification']=dto.Specification;
      params['GoodsType']='ASSET';

      result['Asset'].push(params);
    }

    
    // await this.createOutletGoods(result);

    return  result['Asset'];
  }

 
 
}
