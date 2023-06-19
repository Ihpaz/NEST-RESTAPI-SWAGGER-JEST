import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { BookDto } from './dto/book.dto';
import { BookDatatableDTO } from './dto/bookdatatable.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {

  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ){}
  
 async create(dto: BookDto) {
    await this.bookRepository.save(dto)
    return dto;
  }

  async findAll(dto:BookDatatableDTO) {

    let param={};
    const limit=dto.take  && +dto.take > 0  ? dto.take   : 10;
    const skip=dto.skip  && +dto.skip >= 0  ? dto.skip   : 0;

    const sortType=['DESC','ASC'];

    param['take']=limit;
    param['skip']=skip;
    param['order']=dto.orderBy;
    param['where']=dto.Filter;


    for(let prm in dto){
        const orderParam=this.generateParam(prm);

        if(orderParam){

          if(!sortType.includes(dto[prm])) throw new BadRequestException('Sorting value only allowed ASC|DESC');
          param['order'][orderParam]= dto[prm];
          
        }else if(!['take','skip'].includes(prm)){
          param['where'][prm]=Like(`%${dto[prm]}%`)
        }
    }

    const [data, total]= await this.bookRepository.findAndCount(param);

    return {
      data: data,
      count: total,
      limit: +limit,
      skip: +skip
    };

  }

  async findOne(id: number) {
    const data= await this.bookRepository.findOneBy({
      id:id,
    })

    if(!data) throw new NotFoundException();

    return data;
  }

 async update(id: number, dto: BookDto) {
    //throw error when not exist
    const params={};

    await this.findOne(id)

    params['Author']=dto.Author;
    params['Ayod']=dto.Ayod;
    params['Title']=dto.Title;
    params['Tags']=dto.Tags;
    params['Publisher']=dto.Publisher;

    await this.bookRepository.update({id:id},params)

    const result=  await this.findOne(id)

    return result;
  }

  async remove(id: number) {
   //throw error when not exist
   await this.findOne(id)

    await this.bookRepository.delete(id);
    
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
