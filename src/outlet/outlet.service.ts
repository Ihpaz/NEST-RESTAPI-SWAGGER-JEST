import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { OutletDto } from './dto/Outlet.dto';
import { DatatableDTO } from './dto/Outletdatatable.dto';
import { Outlet } from './entities/Outlet.entity';
import { District } from './entities/district.entity';
import { Workbook, stream } from 'exceljs';
import * as tmp from 'tmp';
import { writeFile } from 'fs/promises';
import { promises } from 'dns';
import { rejects } from 'assert';
import { Employee } from './entities/employee.entity';
import { QueryHelper } from 'src/helpers/query.helper';

@Injectable()
export class OutletsService {

  constructor(
    @InjectRepository(Outlet)
    private OutletRepository: Repository<Outlet>,
    @InjectRepository(District)
    private DistrictRepository: Repository<District>,
    @InjectRepository(Employee)
    private EmployeeRepository: Repository<Employee>,
    private _queryHelper:QueryHelper,
  ){}
  
 async create(dto: OutletDto) {
   const outlet= await this.OutletRepository.save(dto)

    for(const dt of dto.Employee){
      let paramemp={};
      paramemp['outlet']=outlet.id;
      await this.EmployeeRepository.update({EmpID:dt},paramemp)
    }

    return dto;
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

  
    const [data, total]= await this.OutletRepository.findAndCount(param);
 
    return {
      data: data,
      total: total,
      limit: +limit,
      skip: +skip
    };

  }

  async findOne(id: number) {
    const data= await this.OutletRepository.findOne({where:{
      id:id,}, relations: ['employee'] ,
    })

    if(!data) throw new NotFoundException();

    return data;
  }


  async findOneOutletGoods(id: number) {

    // const data=await this._queryHelper.getOne(`SELECT  o.*,
    //                                            FROM outlet o 
    //                                            INNER JOIN goods_outlet go ON o.id=go.OutletId
    //                                            INNER JOIN goods g ON go.GoodsId=g.id`)
    const data= await this.OutletRepository.findOne({where:{
      id:id,}, relations: ['goodsOutlet'] ,
    })

    if(!data) throw new NotFoundException();

    return data;
  }

 async update(id: number, dto: OutletDto) {
    //throw error when not exist
    const params={};

    await this.findOne(id)
    const dtEmpOutlet=await this.findAllEmployee({outletId:id});

    params['Am']=dto.Am;
    params['Drm']=dto.Drm;
    params['CodeOutlet']=dto.CodeOutlet;
    params['OutletName']=dto.OutletName;
    params['DistrictArea']=dto.DistrictArea;
    params['OutletStatus']=dto.OutletStatus;
    params['OutletType']=dto.OutletType;
    params['OutletMallType']=dto.OutletMallType;
    params['Address']=dto.Address;
    params['Ownership']=dto.Ownership;

    await this.OutletRepository.update({id:id},params)

    
    for(const i in dtEmpOutlet){
      if(!dto.Employee.includes(dtEmpOutlet[i].EmpID)){
        let paramemp={};
        paramemp['outlet']=null;
        await this.EmployeeRepository.update({EmpID:dtEmpOutlet[i].EmpID},paramemp)
      }
    }

    for(const dt of dto.Employee){
      let paramemp={};
      paramemp['outlet']=id;
      await this.EmployeeRepository.update({EmpID:dt},paramemp)
    }
   
    const result=  await this.findOne(id)
    return result;
 }

  async remove(id: number) {
   //throw error when not exist
   await this.findOne(id)

    await this.OutletRepository.delete(id);
    
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


  async findAllDistrict(){

    const data=await this.DistrictRepository.find();

    return data;
  }

  async findAllOutlet(){

    const data=await this.OutletRepository.find();

    return data;
  }

  async findAllEmployee(filter:any={}){
    let data={};

    if(filter){
       data=await this.EmployeeRepository.find(filter);
    }else{
      data=await this.EmployeeRepository.find();
    }
 
    
    return data;
  }

  async downloadExcel(){
    const data= await this.findAllOutlet()
  
    let book= new Workbook();

    let worksheet = book.addWorksheet(`sheet1`);
    const headerRow = worksheet.getRow(1);
    headerRow.getCell(1).value = 'Am';
    headerRow.getCell(2).value = 'Drm';
    headerRow.getCell(3).value = 'Code';
    headerRow.getCell(4).value = 'Outlet Name';
    headerRow.getCell(5).value = 'District Area';
    headerRow.getCell(6).value = 'Outlet Type';
    headerRow.getCell(7).value = 'Outlet Status';

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
      
      worksheet.getCell(`A${index + 2}`).value = row.Am;
      worksheet.getCell(`B${index + 2}`).value = row.Drm;
      worksheet.getCell(`C${index + 2}`).value = row.CodeOutlet;
      worksheet.getCell(`D${index + 2}`).value = row.OutletName;
      worksheet.getCell(`E${index + 2}`).value = row.DistrictArea;
      worksheet.getCell(`F${index + 2}`).value = row.OutletType;
      worksheet.getCell(`G${index + 2}`).value = row.OutletStatus;
      // Add more columns as needed
    });

   

// write to a new buffer
    const buffer = await book.xlsx.writeBuffer();
    
    return buffer
  }

 
 
}
