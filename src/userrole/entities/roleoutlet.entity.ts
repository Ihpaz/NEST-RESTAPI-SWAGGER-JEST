import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { GoodsOutlet } from 'src/outlet-goods/entities/goodsoutlet.entity';
import { User } from 'src/auth/entities/user.entity';
import { UserRole } from './userrole.entity';
import { Outlet } from 'src/outlet/entities/Outlet.entity';

@Entity()
export class RoleOutlet {

  @PrimaryGeneratedColumn()
  RoleId: number;

  @ApiProperty()
  @Column()
  OutletId: string;

  @ApiProperty()
  @Column()
  IsActive: number;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date; // Creation date

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @ManyToOne(() => UserRole, userrole => userrole.roleOutlet)
  @JoinColumn({ name: 'RoleId' })
  userrole: UserRole;

  @ManyToOne(() => Outlet, outlet => outlet.roleOutlet)
  @JoinColumn({ name: 'OutletId' })
  outlet: Outlet[];

}