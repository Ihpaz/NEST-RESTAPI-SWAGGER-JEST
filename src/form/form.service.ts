import { Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';
import { Form } from './entities/Form.entity';
import { FormQuestions } from './entities/FormQuestions.entity';
import { FormOptions } from './entities/FormOptions.entity';
import { QueryHelper } from 'src/helpers/query.helper';
import { DatatableDTO } from 'src/outlet/dto/Outletdatatable.dto';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private FormRepository: Repository<Form>,
    @InjectRepository(FormQuestions)
    private FormQuestionsRepository: Repository<FormQuestions>,
    @InjectRepository(FormOptions)
    private FormOptionsRepository: Repository<FormOptions>,
    private _queryHelper : QueryHelper
  ){

  }
  async create(dto: CreateFormDto) {
    const queryRunner = this._queryHelper.queryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      
      const form = new Form();
      form.Tittle = dto.Tittle;
      form.Remarks = dto.Remarks;
      form.RequiredTime = dto.RequiredTime;
      let formdt:any;
      let idForm:any;


      if(dto.id){
         formdt= await queryRunner.manager.update('form',{id:dto.id},form);
         idForm=dto.id;
      }else{
         formdt= await queryRunner.manager.save(form);
         idForm=formdt.id;
      }
     
    
      if(dto.id) queryRunner.manager.delete('FormOptions',{form:dto.id});
       
      if(dto.id) queryRunner.manager.delete('FormQuestions',{form:dto.id});
        
      
  

      for(const dt of dto.Questions){
        const questions = new FormQuestions()
        questions.QuestionName = dt.QuestionName;
        questions.QuestionType = dt.QuestionType;
        questions.IsRequired = dt.IsRequired;
        questions.form = idForm;
  
        await queryRunner.manager.save(questions);
        
       
        if(dto.id) queryRunner.manager.delete('FormOptions',{formquestion:questions.id});
        if(dt.Options){
          for(const dtOptions of dt.Options){
  
            if(dtOptions){
             
              const options = new FormOptions()
              options.label = dtOptions.label;
              options.value = dtOptions.value;
              options.formquestion = questions;
              options.form = idForm;
      
              await queryRunner.manager.save(options);
            }
            
          }
        }
      
      }

      await queryRunner.commitTransaction();
      return await this.findOne(idForm);
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new Error(error.message);
    } finally {
        await queryRunner.release();
    }
  }

  async findAll(dto:DatatableDTO) {
    try {
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

    
      const [data, total]= await this.FormRepository.findAndCount(param);
  
      return {
        data: data,
        total: total,
        limit: +limit,
        skip: +skip
      };

    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const dataForm= await this.FormRepository.findOne({where:{
        id:id,} ,
      });


      const dtQuestions= await this._queryHelper.builder().
        select(`
          *
        `)
        .from('form_questions','fq')
        .where('fq.formid=:formid',{formid:id})
        .getRawMany();


      for(const dt of dtQuestions){

          const dtOptions= await this._queryHelper.builder().
          select(`
            *
          `)
          .from('form_options','fo')
          .where('fo.formquestionid=:qid',{qid:dt.id})
          .getRawMany();

          dt['Options']= dtOptions;

      }

      dataForm['Questions']=  dtQuestions;

      const dtAnswer= await this._queryHelper.builder().
        select(`
          *
        `)
        .from('form_answers','fa')
        .where('fa.formid=:formid',{formid:id})
        .getRawMany();

      for(const dt of dtAnswer){

          const dtOptions= await this._queryHelper.builder().
          select(`
            *
          `)
          .from('form_options_answer','foa')
          .where('foa.formanswerid=:qid',{qid:dt.id})
          .getRawMany();

          dt['Options']= dtOptions;
      }

      dataForm['Answer']=  dtAnswer;
      
      return dataForm;

    } catch (error) {
      throw new Error(error.message);
    }
  }



  async remove(id: number) {
    const queryRunner = this._queryHelper.queryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      
      queryRunner.manager.delete('Form',{id:id});

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new Error(error.message);
    } finally {
        await queryRunner.release();
    }
  }
}
