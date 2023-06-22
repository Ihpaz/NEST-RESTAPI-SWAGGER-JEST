import { Get, Injectable, Req, Res } from '@nestjs/common';
import { CreateVocDto } from './dto/create-voc.dto';
import { UpdateVocDto } from './dto/update-voc.dto';
import { Workbook } from 'exceljs';
import { Config } from 'src/helpers/config.helper';
import { join } from 'path';
import { DatatableDTO } from 'src/outlet/dto/Outletdatatable.dto';
import { Any, Equal, LessThan, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Voc } from './entities/voc.entity';
import { QueryHelper } from 'src/helpers/query.helper';
import { dateMoment } from 'src/helpers/date.helper';
import { responseError } from 'src/helpers/response.helper';
import { CreateVocNegatifDto } from './dto/create-voc-negatif.dto';
import { VocNegatif } from './entities/vocnegatif.entity';
import { equal } from 'assert';
import { UpdateVocNegatifDto } from './dto/update-voc-negatif.dto';
import { VocNegatifCategory } from './entities/vocnegatifcategory.entity';
import { FilterGrafikVoc } from './dto/filter-grafik-voc.dto';


@Injectable()
export class VocService {

  constructor(
    @InjectRepository(Voc)
    private VocRepository: Repository<Voc>,
    @InjectRepository(VocNegatif)
    private VocNegatifRepository: Repository<VocNegatif>,
    @InjectRepository(VocNegatifCategory)
    private VocNegatifCategoryRepository: Repository<VocNegatifCategory>,
    private _queryHelper : QueryHelper
  ){}

  bulan:string[]=['Januari','Febuari','Maret','April','Mei','Juni','Juli',
  'Agustus','September','Oktober','November','Desember'];

  async create(dto: CreateVocDto) {
    const queryRunner = this._queryHelper.queryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    
   try {
    
    for(const item of dto.Voc){
      
      const voc = new Voc();
         

          voc.OutletName=item.OutletName ? item.OutletName :'';
          voc.Menu=item.Menu ? item.Menu : '';
          voc.Suka=item.Suka ? item.Suka : 0;
          voc.Rekom=item.Rekom ? item.Rekom : 0;
          voc.Rating=item.Rating ? item.Rating : 0;
          voc.Saran=item.Saran;
          voc.Source=item.Source;
          voc.Am=item.Am ? typeof item.Am === 'object' ? '': item.Am :'';
          voc.Drm=item.Drm ? typeof item.Drm === 'object' ? '': item.Drm :'';
          voc.VocDate=item.VocDate;
          voc.Category=item.Category ? item.Category : '';

          const vocdt=await queryRunner.manager.save(voc)

        

          if(voc.Category.toLowerCase()=='complain'){
           
            const vocn = new VocNegatif();
            vocn.OutletName=item.OutletName;
            vocn.Comment=item.Saran;
            vocn.Source=item.Source;
            vocn.VocDate=item.VocDate;
            vocn.CategoryComplaint='';
            vocn.SubCategoryComplaint='';
            vocn.voc =vocdt;
            vocn.VocDateOnly=item.VocDate;

            await queryRunner.manager.save(vocn)
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

  async findAll(dto:DatatableDTO) {
   
    let param={};
    const limit=dto.limit  && +dto.limit > 0  ? dto.limit   : 10;
    const skip=dto.skip  && +dto.skip >= 0  ? dto.skip   : 0;

    const newObj ={}
    if(dto.orderBy.field=='Voc_Date') dto.orderBy.field='VocDateOnly';
    if(dto.orderBy.field)  newObj[dto.orderBy.field] = dto.orderBy.value;
   
    param['take']=limit;
    param['skip']=skip;
    param['order']=newObj;
    param['where']=[];


    for(let dt of dto.filter){
       
      if(dt){
        const newObj ={}
        if(dt.field.includes('Date')){
          if(dt.field=='Voc_Date') dt.field='VocDateOnly';
          const dtDate= dateMoment(dt.value).format('YYYY-MM-DD')
          newObj[dt.field] = Equal(dtDate);
        }else{
          newObj[dt.field] =Like(`%${dt.value}%`);
        }
        param['where'].push(newObj);
      }
    }

    const [data, total]= await this.VocRepository.findAndCount(param);
   
    for(const dt of data){

      if(dt['VocDate'])   dt['Voc_Date'] =dateMoment(dt['VocDate'].toString()).format('YYYY-MM-DD HH:mm');
      
    }

    return {
      data: data,
      total: total,
      limit: +limit,
      skip: +skip
    };
  }



  async downloadTemplateVOC(){
    // const data= await this.findAllGoods({where:{GoodsType:'ASSET'}})
  
    let book= new Workbook();

    let worksheet = book.addWorksheet(`COMBINE ALL NEGATIVE VOC`);
   

    const headerRow = worksheet.getRow(1);
    headerRow.getCell(1).value = 'Nama Outlet';
    headerRow.getCell(2).value = 'MENU';
    headerRow.getCell(3).value = 'SUKA';
    headerRow.getCell(4).value = 'REKOM';
    headerRow.getCell(5).value = 'RATING';
    headerRow.getCell(6).value = 'SARAN';
    headerRow.getCell(7).value = 'DATE_CREATED';
    headerRow.getCell(8).value = 'SOURCE';
    headerRow.getCell(9).value = 'AM';
    headerRow.getCell(10).value = 'DRM';
    headerRow.getCell(11).value = 'CATEGORY';


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


    

    // worksheet.protect('sevenretail123',{selectLockedCells:true,formatCells:true,formatColumns:true});

    // const column = worksheet.getColumn(4);
    // column.eachCell((cell) => {
    //   cell.protection = {
    //     locked: false
    //   };
    // });
// write to a new buffer
    const buffer = await book.xlsx.writeBuffer();
    
    return buffer
  }

  async importTemplateVOC(dto:any){

    const resultImport: any = {};
          resultImport['Voc'] = [];
    
    const workbook = new Workbook();
    const pathRaw = join(`${Config.get('FOLDER_UPLOAD')}${Config.get('TEMP_RAW_PATH_FILE')}/`, dto.Attachment);

    await workbook.xlsx.readFile(pathRaw)
      .then(() => {
        // Excel file loaded successfully
        const worksheet = workbook.getWorksheet(1); // Get the first worksheet

    
        for (let i = 2; i <= worksheet.rowCount; i++) {
            const singleResult: any = {};

            const OutletName=worksheet.getCell(`A${i}`).value;
            const Menu=worksheet.getCell(`B${i}`).value;
            const Suka=worksheet.getCell(`C${i}`).value;
            const Rekom=worksheet.getCell(`D${i}`).value;
            const Rating=worksheet.getCell(`E${i}`).value;
            const Saran=worksheet.getCell(`F${i}`).value;
            const VocDate=worksheet.getCell(`G${i}`).value;
            const Source=worksheet.getCell(`H${i}`).value;
            const Am=worksheet.getCell(`I${i}`).value;
            const Drm=worksheet.getCell(`J${i}`).value;
            const Category=worksheet.getCell(`K${i}`).value;

          
              singleResult['OutletName'] = OutletName;
              singleResult['Menu'] = Menu;
              singleResult['Suka'] = Suka;
              singleResult['Rekom'] = Rekom;
              singleResult['Rating'] = Rating;
              singleResult['Saran'] = Saran;
              singleResult['VocDate'] = VocDate;
              singleResult['Source'] = Source;
              singleResult['Am'] = Am;
              singleResult['Drm'] = Drm;
              singleResult['Category'] = Category;

            
              resultImport['Voc'].push(singleResult);
        }


        
      
      })
      .catch((error) => {
        // Error occurred while loading the Excel file
        console.log('Error:', error);
    });
    await this.create(resultImport)
    return resultImport;
  }

  async CreateVocNegatif(dto:CreateVocNegatifDto){
    try {
      const queryRunner = this._queryHelper.queryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
  
     try {

      const dateNow = dateMoment(dto.FilterDate.toString()).format('YYYY-MM-DD');
    
        queryRunner.manager.delete('VocNegatif',{
          VocDate: Equal(dateNow),
        });

        for(const item of dto.Voc){
  
            const voc = new VocNegatif();
            voc.OutletName=item.OutletName;
            voc.Comment=item.Comment;
            voc.Source=item.Source;
            voc.CategoryComplaint=item.CategoryComplaint;
            voc.SubCategoryComplaint=item.SubCategoryComplaint;
            voc.VocDate=item.VocDate;
            voc.VocDateOnly=item.VocDate;
  
            await queryRunner.manager.save(voc)
        }
  
        await queryRunner.commitTransaction();
        return true;
      } catch (error) {
          await queryRunner.rollbackTransaction();
          throw new Error(error.message);
      } finally {
          await queryRunner.release();
      }
    } catch (error) {
      responseError(error.message)
    }
  }
  
  async findAllVocNegatif(dto:DatatableDTO) {
   
    let param={};
    const limit=dto.limit  && +dto.limit > 0  ? dto.limit   : 10;
    const skip=dto.skip  && +dto.skip >= 0  ? dto.skip   : 0;

    const newObj ={}

    if(dto.orderBy.field=='Voc_Date') dto.orderBy.field='VocDateOnly';
    if(dto.orderBy.field)  newObj[dto.orderBy.field] = dto.orderBy.value;
   
    param['take']=limit;
    param['skip']=skip;
    param['order']=newObj;
    param['where']=[];


    for(let dt of dto.filter){
       
      if(dt){
        const newObj ={}

       
          if(dt.field.includes('Date')){
            if(dt.field=='Voc_Date') dt.field='VocDateOnly';

            const dtDate= dateMoment(dt.value).format('YYYY-MM-DD')
            // const dtDateMax= dateMoment(dt.value).format('YYYY-MM-DD')
            newObj[dt.field] = Equal(dtDate);
          }else{
            newObj[dt.field] =Like(`%${dt.value}%`);
          }
        
        
       
        param['where'].push(newObj);
      }
    }
  
    const [data, total]= await this.VocNegatifRepository.findAndCount(param);
    
    for(const dt of data){

      if(dt['VocDate'])   dt['Voc_Date'] =dateMoment(dt['VocDate'].toString()).format('YYYY-MM-DD HH:mm');
      
    }

    return {
      data: data,
      total: total,
      limit: +limit,
      skip: +skip
    };
  }

  async findOneVocNegatif(id:number){
    try {
      const data= await this.VocNegatifRepository.findOne({where:{
        id:id,}, relations: ['voc'] ,
      })

      return data;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async updateVocNegatif(id: number, dto: UpdateVocNegatifDto) {
    try {
      //throw error when not exist
      const params={};

    
      params['CategoryComplaint']=dto.CategoryComplaint;
      params['SubCategoryComplaint']=dto.SubCategoryComplaint;
    

      await this.VocNegatifRepository.update({id:id},params)

   
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
    
  }

  async removeVoc(id:number){
    const queryRunner = this._queryHelper.queryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

        queryRunner.manager.delete('VocNegatif',{voc:id});
        queryRunner.manager.delete('voc',{id:id});
        
        await queryRunner.commitTransaction();
        return true;
      } catch (error) {
          await queryRunner.rollbackTransaction();
          throw new Error(error.message);
      } finally {
          await queryRunner.release();
      }
    
  }

  async createVocNegatifCategory(){
    const queryRunner = this._queryHelper.queryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      // const  listSubCategoryComplaint:any[]=[
      //   {Category:'BBQ',Title:'NASI',Code:'NASI',Problem:['Keras','Lembek','Dingin']},
      //   {Category:'BBQ',Title:'Ayam/Bebek',Code:'BBQ-1',Problem:['Kering','Keras','Alot']}, 
      //   {Category:'BBQ',Title:'Ayam/Bebek',Code:'BBQ-2',Problem:['Tidak Matang','Busuk']},  
      //   {Category:'BBQ',Title:'Ayam/Bebek',Code:'BBQ-3',Problem:['Potongan Kecil','Hancur']}, 
      //   {Category:'BBQ',Title:'Ayam/Bebek',Code:'BBQ-4',Problem:['Not Crispy/Too Hard']},  
      //   {Category:'BBQ',Title:'Ayam/Bebek',Code:'BBQ-5',Problem:['Asam/Pahit/Amis']}, 
      //   {Category:'BBQ',Title:'Sauce',Code:'BBQ-6',Problem:['Spicy Consistency']},   
      //   {Category:'FOOD SAFETY',Title:'Foreign Material',Code:'FS',Problem:['Ada ranbut,Pecahan kaca,cangkang telur,kerikil,ulat']}, 
      //   {Category:'SIDE DISH',Title:'Siomay/Gorengan',Code:'SD-1',Problem:['Asin/Hambar/Asam']},                        
      //   {Category:'SIDE DISH',Title:'Siomay/Gorengan',Code:'SD-2',Problem:['Keras/Dingin']}, 
      //   {Category:'CUSTOMER SERVICE',Title:'Cashier/Waiters',Code:'CS-1',Problem:['Jutek','Tidak Ramah','Tidak Sopan']},                
      //   {Category:'CUSTOMER SERVICE',Title:'Cashier/Waiters',Code:'CS-2',Problem:['Tidak Hafal Promo']},                
      //   {Category:'CUSTOMER SERVICE',Title:'Online Order/TA',Code:'Online',Problem:['Missing order/item']},                
      //   {Category:'CUSTOMER SERVICE',Title:'PACKAGING',Code:'PACKAGING',Problem:['Packaging Bocor']},  
      //   {Category:'CUSTOMER SERVICE',Title:'Drinks',Code:'DRINKS',Problem:['Drinks Tasteless (Hambar)']},   
      //   {Category:'CUSTOMER SERVICE',Title:'Ambeince Store',Code:'AMBIENCE-1',Problem:['Kurang Bersih/Ada Lalat']},             
      //   {Category:'CUSTOMER SERVICE',Title:'Ambeince Store',Code:'AMBIENCE-2',Problem:['Suhu Panas']},
      //   {Category:'CUSTOMER SERVICE',Title:'Cuttleries',Code:'CUTTLERIES',Problem:['Tidak Bersih/Rusak']},
      //   {Category:'TOPPER',Title:'Porsi',Code:'PORSI-1',Problem:['Kualitatif(Subjektif Customer)']},
      //   {Category:'TOPPER',Title:'Porsi',Code:'PORSI-2',Problem:['Tidak Sesuai FIS/ Missing Ingredient']},
      //   {Category:'TOPPER',Title:'Soup',Code:'SOUP-1',Problem:['Kuah Dingin']},
      //   {Category:'TOPPER',Title:'Soup',Code:'SOUP-2',Problem:['Rasa Tidak Sesuai(Garlic Miso,Collagen,Tori,Curry,Cheese)']},
      //   {Category:'TOPPER',Title:'TOPPING',Code:'TOP-1',Problem:['Ayam Chasu/Beef Hancur']},
      //   {Category:'TOPPER',Title:'TOPPING',Code:'TOP-2',Problem:['Topping Busuk + Ayam Jamur Asam']},
      //   {Category:'TOPPER',Title:'TOPPING',Code:'TOP-2',Problem:['Topping Busuk + Ayam Jamur Asam']},
      //   {Category:'OUT OF STOCK',Title:'Menu Kosong',Code:'OUT OF STOCK',Problem:['Menu Kosong']},
      //   {Category:'WT',Title:'Waiting Time',Code:'WT',Problem:['Waktu tunggu makanan lama/keluar makanannya lama']},
      //   {Category:'LAMIAN',Title:'TEKSTUR',Code:'LM-1',Problem:['LEMBEK','ALOT','LENGKET']},
      //   {Category:'LAMIAN',Title:'AROMA',Code:'LM-2',Problem:['Bau Kecoa/Bau Tidak Sedap']},
      //   {Category:'OTHERS',Title:'',Code:'OTHERS',Problem:['Masalah tidak specifik atau variable terlalu luas dengan frekuensi yang rendah']},
      //   {Category:'SARAN',Title:'',Code:'SARAN',Problem:['Customer merasa bad experience tpi tidak menjelaskan masalahnya apa melainkan kasih masukan']},
      // ]

      // for(const dt of listSubCategoryComplaint){

      //   const params={};
      //   params['Category']=dt.Category;
      //   params['Title']=dt.Title;
      //   params['Code']=dt.Code;
      //   params['Problem']=dt.Problem;
      //  await queryRunner.manager.save('VocNegatifCategory',params);
        
      // }

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
        await queryRunner.release();
    }
  }

  async getDashboardVocBarByMonth(dto:FilterGrafikVoc){
    try {

      dto.StartDate =dateMoment(dto.StartDate.toString()).toDate();
      dto.EndDate =dateMoment(dto.EndDate.toString()).toDate();
     
      let output:any[]=[];
      let labels:string[]=[];

      let additionalWhere:string='';
      if(dto.TypeVoc) additionalWhere='and vnc.Category=:Code';

      const result = await this._queryHelper.getMany(`
        select 
          vnc.Category,
          month(vn.VocDate) as Bulan,
          IFNULL(COUNT(vn.CategoryComplaint),0) as jumlahComplain
        from
        (select Category from voc_negatif_category group by Category) vnc 
        left join (select * from voc_negatif where VocDate  between :StartDate and :EndDate) vn  
          on vnc.Category = vn.CategoryComplaint 
        WHERE 1=1  ${additionalWhere}
        group by month(vn.VocDate),vnc.Category
      `,{
        StartDate:dto.StartDate,
        EndDate:dto.EndDate,
        Code:dto.TypeVoc
      });
     
      const dtCategory=[];
      for(const item of result){
          let data:number[]=[];
        
          if(!dtCategory.includes(item.Category)){
          
            for(let x=dto.StartDate.getMonth(); x<= dto.EndDate.getMonth(); x++){
              
              if(!labels.includes(this.bulan[x]))  labels.push(this.bulan[x]);
            
              let value:number=0;
              for(const i of result){
                  if(x == (i.Bulan-1) && item.Category == i.Category){
                    value = parseInt(i.jumlahComplain);
                  }
              }
    
              data.push(value);
            }

            dtCategory.push(item.Category);
            output.push({
              data:data,label:item.Category
            });
          }
      }

      return {
        labels:labels,
        data:output,
      }

    } catch (error) {
      throw new Error(error.message);
    }    
  }

  async getDashboardVocRankByOutlet(dto:DatatableDTO){
    try {
     

      const limit=dto.limit  && +dto.limit > 0  ? dto.limit   : 10;
      const skip=dto.skip  && +dto.skip >= 0  ? dto.skip   : 0;

      let orderBy: string='order by rank';
      let addWhere: string='';

      if(dto.orderBy.field) orderBy=`order by ${dto.orderBy.field} ${dto.orderBy.value}`;
      if(dto.data.TypeVoc) addWhere=' WHERE vn.CategoryComplaint = :Code';

      const result = await this._queryHelper.getMany(`
          select 
            o.OutletName,
            o.drm,
            o.am,
            IFNULL(COUNT(vn.id),0) as qty,
            RANK() OVER (ORDER BY IFNULL(COUNT(vn.id),0) DESC) AS rank
          from
          outlet o
          left join  (select * from voc_negatif where VocDate  between :StartDate and :EndDate) vn   
          on vn.OutletName = o.OutletName 
          ${addWhere}
          group by o.OutletName
          ${orderBy}
      `,{
        StartDate:dateMoment(dto.data.StartDate).toDate(),
        EndDate:dateMoment(dto.data.EndDate).toDate(),
        ofield:dto.orderBy.field,
        ovalue:dto.orderBy.value,
        Code:dto.data.TypeVoc
      });

    
   
      const total = await this._queryHelper.getOne(`
          SELECT COUNT(OutletName) AS total FROM outlet
      `);

      return {
        data: result,
        total: +total.total,
        limit: +limit,
        skip: +skip
      };

    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getRequestVocRankForPdf(dto: any){
    try {
      let data: object={};
      let orderBy: object={}
      let filter: any[]=[]
      for(let key in dto){
          if(key.includes('data')){
             data[key.replace('data','')] = dto[key]
          }

          if(key.includes('orderBy')){
            orderBy['field'] =dto.orderByfield;
            orderBy['value'] =dto.orderByvalue;
          }

          if(key.includes('filter')){
            let filterDt: object={};
            filterDt['field'] =key.replace('filter','');
            filterDt['value'] =dto[key];
            filter.push(filterDt);
          }

      }
      const dtoDatatable : any = {
        limit: +dto.limit,
        skip: +dto.skip,
        orderBy: orderBy,
        filter:filter,
        data:data
      };
      
     
      const rawData = await this.getDashboardVocRankByOutlet(dtoDatatable)
      const listData: any[] =[];
      let vocFilter: string='All';

      if(data['TypeVoc']){
        vocFilter=data['TypeVoc'];
      }
     
      let jumlahQty:number=0;
      for(const item of rawData.data){
        jumlahQty=(jumlahQty+parseInt(item.qty));
      }

      listData.push({
        title:'Rank Voc',
        listrank:rawData.data,
        StartDate:dateMoment(data['StartDate']).format('YYYY-MM-DD'),
        EndDate:dateMoment(data['EndDate']).format('YYYY-MM-DD'),
        vocFilter:vocFilter,
        jumlahQty:jumlahQty,
        printDate:dateMoment().format('YYYY-MM-DD HH:mm')
      });

      const result : any[]=[];
      result['data'] = listData;

    

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getDashboardVocBYCategoryDaytoDay(dto:DatatableDTO){
    try {
     

      const limit=dto.limit  && +dto.limit > 0  ? dto.limit   : 10;
      const skip=dto.skip  && +dto.skip >= 0  ? dto.skip   : 0;

      let orderBy: string='order by rank';

      if(dto.orderBy.field) orderBy=`order by ${dto.orderBy.field} ${dto.orderBy.value}`;

      const result = await this._queryHelper.getMany(`
          select 
            vnc.Category ,
            vnc.Title,
            vnc.Code,
            vnc.Problem,
            case 
                when DAY(vn.VocDate) = 1 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '1',
            case 
                when DAY(vn.VocDate) = 2 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '2',
            case 
                when DAY(vn.VocDate) = 3 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '3',
            case 
                when DAY(vn.VocDate) = 4 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '4',
            case 
                when DAY(vn.VocDate) = 5 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '5',
            case 
                when DAY(vn.VocDate) = 6 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '6',
            case 
                when DAY(vn.VocDate) = 7 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '7',
            case 
                when DAY(vn.VocDate) = 8 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '8',
            case 
                when DAY(vn.VocDate) = 9 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '9',
            case 
                when DAY(vn.VocDate) = 10 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '10',
            case 
                when DAY(vn.VocDate) = 11 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '11',
            case 
                when DAY(vn.VocDate) = 12 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '12',
            case 
                when DAY(vn.VocDate) = 13 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '13',
            case 
                when DAY(vn.VocDate) = 14 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '14',
            case 
                when DAY(vn.VocDate) = 15 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '15',
            case 
                when DAY(vn.VocDate) = 16 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '16',
            case 
                when DAY(vn.VocDate) = 17 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '17',
            case 
                when DAY(vn.VocDate) = 18 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '18',
            case 
                when DAY(vn.VocDate) = 19 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '19',
            case 
                when DAY(vn.VocDate) = 20 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '20',
            case 
                when DAY(vn.VocDate) = 21 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '21',
            case 
                when DAY(vn.VocDate) = 22 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '22',
            case 
                when DAY(vn.VocDate) = 23 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '23',
            case 
                when DAY(vn.VocDate) = 24 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '24',
            case 
                when DAY(vn.VocDate) = 25 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '25',
            case 
                when DAY(vn.VocDate) = 26 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '26',
            case 
                when DAY(vn.VocDate) = 27 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '27',
            case 
                when DAY(vn.VocDate) = 28 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '28',
            case 
                when DAY(vn.VocDate) = 29 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '29',
            case 
                when DAY(vn.VocDate) = 30 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '30',
            case 
                when DAY(vn.VocDate) = 31 then
                IFNULL(count(vn.id),0)
                else
                0
            end as  '31'
          from
          voc_negatif_category vnc 
          left join (select * from voc_negatif where year(VocDate) = :Year and month(VocDate)=:Month ) vn  
            on vnc.Code = vn.SubCategoryComplaint 
          WHERE 1=1  and vn.SubCategoryComplaint is not null 
          group by vn.VocDateOnly,vn.SubCategoryComplaint
          ${orderBy}
        `,{
          Year: dto.data.Year,
          Month:dto.data.Month,
          ofield:dto.orderBy.field,
          ovalue:dto.orderBy.value,
        });

    
   
      const total = await this._queryHelper.getOne(`
          SELECT COUNT(OutletName) AS total FROM voc_negatif_category
      `);

      return {
        data: result,
        total: +total.total,
        limit: +limit,
        skip: +skip
      };

    } catch (error) {
      throw new Error(error.message);
    }
  }
 
}
