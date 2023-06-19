import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/userrole/entities/userrole.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Form } from './Form.entity';
import { FormQuestions } from './FormQuestions.entity';
import { User } from 'src/auth/entities/user.entity';
import { FormOptionsAnswer } from './FormOptionsAnswer.entity';

@Entity()
export class FormAnswers {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  InputDate: Date;

  @ApiProperty()
  @Column()
  CodeOutlet: string;

  @ApiProperty()
  @Column()
  QuestionsName: string;

  @ApiProperty()
  @Column()
  QuestionType: string;

  @ApiProperty()
  @Column()
  AnswerValue: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date; // Creation date

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @ManyToOne(() => Form, (form) => form.formanswer)
  form: Form;

  @ManyToOne(() => FormQuestions, (form) => form.formanswer)
  formquestion: FormQuestions;

  @ManyToOne(() => User, (user) => user.formanswer)
  user: User;

  @OneToMany(() => FormOptionsAnswer, (formanswer) => formanswer.formanswer)
  formanswer: FormOptionsAnswer[];

}
