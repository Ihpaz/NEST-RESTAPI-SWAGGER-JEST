import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Outlet } from './Outlet.entity';

@Entity()
export class Employee {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  EmpID: string;

  @ApiProperty()
  @Column()
  FullName: string;

  @ApiProperty()
  @Column()
  Email: string;

  @ApiProperty()
  @Column()
  NoHp: string;

  @ApiProperty()
  @Column()
  Position: string;

  @ManyToOne(() => Outlet, outlet => outlet.employee)
  @JoinColumn({ name: 'outletId' })
  outlet: Outlet;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date; // Creation date

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date; // Last updated date

}
