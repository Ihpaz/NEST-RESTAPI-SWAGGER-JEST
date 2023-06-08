import { ApiProperty } from '@nestjs/swagger';
import { Outlet } from 'src/outlet/entities/Outlet.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';

@Entity()
export class Goods {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  GoodsName: string;

  @ApiProperty()
  @Column()
  Specification: string;

  @ApiProperty()
  @Column()
  GoodsType: string;
   
  @ManyToMany(() => Outlet, outlet => outlet.goods)
  outlet: Outlet[];

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date; // Creation date

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date; // Last updated date

}
