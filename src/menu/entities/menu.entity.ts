import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Menu {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  Menuname: string;

  @ApiProperty()
  @Column()
  Link: string;

  @ApiProperty()
  @Column()
  IsActive: number;


  @ApiProperty()
  @CreateDateColumn()
  created_at: Date; // Creation date

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date; // Last updated date

}
