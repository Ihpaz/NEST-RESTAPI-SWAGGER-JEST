import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/userrole/entities/userrole.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Form } from './Form.entity';
import { FormAnswers } from './FormAnswers.entity';
import { FormOptions } from './FormOptions.entity';

@Entity()
export class FormQuestions {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  QuestionName: string;

  @ApiProperty()
  @Column()
  QuestionType: string;
  
  @ApiProperty()
  @Column()
  IsRequired : number;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date; // Creation date

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @ManyToOne(() => Form, (form) => form.formquestions)
  form: Form;

  @OneToMany(() => FormAnswers, (formanswer) => formanswer.formquestion)
  formanswer: FormAnswers[];

  @OneToMany(() => FormOptions, (formoptions) => formoptions.formquestion)
  formoptions: FormOptions[];

}
