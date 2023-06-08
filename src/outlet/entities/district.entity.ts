import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class District {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  DistrictArea: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date; // Creation date

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date; // Last updated date

}
