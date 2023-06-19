import { ApiProperty } from '@nestjs/swagger';
import { FormAnswers } from 'src/form/entities/FormAnswers.entity';
import { UserRole } from 'src/userrole/entities/userrole.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  Username: string;

  @ApiProperty()
  @Column()
  Password: string;

  @ApiProperty()
  @Column()
  IsActive: number;

  @ApiProperty()
  @Column()
  Email: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date; // Creation date

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @ManyToOne(() => UserRole, (userrole) => userrole.user)
  userrole: UserRole

  @OneToMany(() => FormAnswers, (formanswer) => formanswer.user)
  formanswer: FormAnswers[];

}
