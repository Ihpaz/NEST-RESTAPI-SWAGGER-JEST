import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { OutletDto } from './dto/Outlet.dto';
import { OutletDatatableDTO } from './dto/Outletdatatable.dto';
import { Outlet } from './entities/Outlet.entity';

@Injectable()
export class OutletsService {

  constructor(
    @InjectRepository(Outlet)
    private OutletRepository: Repository<Outlet>,
  ){}
  
 async create(dto: OutletDto) {
    await this.OutletRepository.save(dto)
    return dto;
  }

  async findAll(dto:OutletDatatableDTO) {

    let param={};
    const limit=dto.take  && +dto.take > 0  ? dto.take   : 10;
    const skip=dto.skip  && +dto.skip >= 0  ? dto.skip   : 0;

    const sortType=['DESC','ASC'];

    param['take']=limit;
    param['skip']=skip;
    param['order']={};
    param['where']={};


    for(let prm in dto){
        const orderParam=this.generateParam(prm);

        if(orderParam){

          if(!sortType.includes(dto[prm])) throw new BadRequestException('Sorting value only allowed ASC|DESC');
          param['order'][orderParam]= dto[prm];
          
        }else if(!['take','skip'].includes(prm)){
          param['where'][prm]=Like(`%${dto[prm]}%`)
        }
    }

    const [data, total]= await this.OutletRepository.findAndCount(param);

    return {
      data: data,
      count: total,
      limit: +limit,
      skip: +skip
    };

  }

  async findOne(id: number) {
    const data= await this.OutletRepository.findOneBy({
      id:id,
    })

    if(!data) throw new NotFoundException();

    return data;
  }

 async update(id: number, dto: OutletDto) {
    //throw error when not exist
    const params={};

    await this.findOne(id)

    params['Am']=dto.Am;
    params['Drm']=dto.Drm;
    params['CodeOutlet']=dto.CodeOutlet;
    params['OutletName']=dto.OutletName;
    params['DistrictArea']=dto.DistrictArea;
    params['OutletStatus']=dto.OutletStatus;
    params['OutletType']=dto.OutletType;


    await this.OutletRepository.update({id:id},params)

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
 
}
