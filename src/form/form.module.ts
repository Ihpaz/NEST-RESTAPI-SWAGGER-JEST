import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { FormQuestions } from './entities/FormQuestions.entity';
import { FormOptions } from './entities/FormOptions.entity';
import { Form } from './entities/Form.entity';
import { FormAnswers } from './entities/FormAnswers.entity';
import { FormOptionsAnswer } from './entities/FormOptionsAnswer.entity';
import { QueryHelper } from 'src/helpers/query.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Form,FormQuestions,FormOptions,FormAnswers,FormOptionsAnswer]),
    AuthModule
  ],
  controllers: [FormController],
  providers: [FormService,QueryHelper]
})
export class FormModule {}
