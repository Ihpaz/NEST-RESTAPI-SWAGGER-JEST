import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/userrole/entities/userrole.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { FormQuestions } from './FormQuestions.entity';
import { FormAnswers } from './FormAnswers.entity';
import { FormOptions } from './FormOptions.entity';

@Entity()
export class Form {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  Tittle: string;

  @ApiProperty()
  @Column()
  Remarks: string;

  @ApiProperty()
  @Column('time', {name: 'elapsed_time'})
  RequiredTime:Date;
  
  @ApiProperty()
  @Column()
  IsActive: number;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date; // Creation date

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
  @OneToMany(() => FormQuestions, (formquestions) => formquestions.form)
  formquestions: FormQuestions[];

  @OneToMany(() => FormAnswers, (formanswer) => formanswer.form)
  formanswer: FormAnswers[];

  @OneToMany(() => FormOptions, (formoption) => formoption.form)
  formoption: FormOptions[];
}
