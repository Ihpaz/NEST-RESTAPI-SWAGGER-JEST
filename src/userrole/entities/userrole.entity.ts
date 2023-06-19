import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { GoodsOutlet } from 'src/outlet-goods/entities/goodsoutlet.entity';
import { User } from 'src/auth/entities/user.entity';
import { RoleOutlet } from './roleoutlet.entity';

@Entity()
export class UserRole {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  Role: string;

  @ApiProperty()
  @Column()
  IsActive: number;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date; // Creation date

  
  @OneToMany(() => RoleOutlet, roleOutlet => roleOutlet.outlet)
  roleOutlet: RoleOutlet[];
  
  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @OneToMany(() => User, (user) => user.userrole)
  user: User[]

}