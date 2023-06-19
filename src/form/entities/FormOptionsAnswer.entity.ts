import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/userrole/entities/userrole.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { FormQuestions } from './FormQuestions.entity';
import { FormAnswers } from './FormAnswers.entity';

@Entity()
export class FormOptionsAnswer {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  OptionsId: number;

  @ApiProperty()
  @Column()
  label: string;

  @ApiProperty()
  @Column()
  value: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date; // Creation date

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @ManyToOne(() => FormQuestions, (formquestion) => formquestion.formoptions)
  formquestion: FormQuestions;

  @ManyToOne(() => FormAnswers, (formanswer) => formanswer.formanswer)
  formanswer: FormAnswers;

}
