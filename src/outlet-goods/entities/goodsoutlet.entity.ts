import { ApiProperty } from '@nestjs/swagger';
import { Outlet } from 'src/outlet/entities/Outlet.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Goods } from './goods.entity';


@Entity()
export class GoodsOutlet {
  @PrimaryColumn()
  outletId: number;

  @PrimaryColumn()
  goodsId: number;

  @PrimaryColumn()
  assetId: number;

  @ApiProperty()
  @Column()
  Qty: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Outlet, outlet => outlet.goods)
  @JoinColumn({ name: 'outletId' })
  outlet: Outlet;

  @ManyToOne(() => Goods, goods => goods.outlet)
  @JoinColumn({ name: 'goodsId' })
  goods: Goods;
}