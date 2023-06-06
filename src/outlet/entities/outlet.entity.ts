import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Outlet {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  Am: string;

  @ApiProperty()
  @Column()
  Drm: string;

  @ApiProperty()
  @Column()
  CodeOutlet: string;

  @ApiProperty()
  @Column()
  OutletName: string;
  
  @ApiProperty()
  @Column()
  DistrictArea: string;

  @ApiProperty()
  @Column()
  OutletType: string;

  @ApiProperty()
  @Column()
  OutletStatus: string;


  @ApiProperty()
  @CreateDateColumn()
  created_at: Date; // Creation date

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date; // Last updated date

}
