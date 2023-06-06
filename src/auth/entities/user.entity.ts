import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

}
