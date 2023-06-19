import { ApiProperty } from '@nestjs/swagger';
import { Outlet } from 'src/outlet/entities/Outlet.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Goods } from './goods.entity';


@Entity()
export class GoodsOutlet {
  @PrimaryColumn()
  OutletId: number;

  @PrimaryColumn()
  GoodsId: number;

  @PrimaryColumn()
  AssetId: string;

  @ApiProperty()
  @Column()
  GoodsName: string;

  @ApiProperty()
  @Column()
  Specification: string;

  @ApiProperty()
  @Column()
  GoodsType: string;

  @ApiProperty()
  @Column()
  Qty: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Outlet, outlet => outlet.roleOutlet)
  @JoinColumn({ name: 'OutletId' })
  outlet: Outlet;

  @ManyToOne(() => Goods, goods => goods.goodsOutlet)
  @JoinColumn({ name: 'GoodsId' })
  goods: Goods;
}