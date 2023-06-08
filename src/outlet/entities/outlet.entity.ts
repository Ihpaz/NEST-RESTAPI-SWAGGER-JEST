import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Employee } from './employee.entity';
import { Goods } from 'src/outlet-goods/entities/goods.entity';


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
  OutletMallType: string;

  @ApiProperty()
  @Column()
  OutletStatus: string;

  @ApiProperty()
  @Column()
  Ownership: string;

  @ApiProperty()
  @Column()
  Address: string;

  @OneToMany(() => Employee, employee => employee.outlet)
  employee: Employee[];

  @ManyToMany(() => Goods, goods => goods.outlet, { cascade: true })
  @JoinTable({ name: 'assetoutlet' })
  goods: Goods[];


  @ApiProperty()
  @CreateDateColumn()
  created_at: Date; // Creation date

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date; // Last updated date

}
