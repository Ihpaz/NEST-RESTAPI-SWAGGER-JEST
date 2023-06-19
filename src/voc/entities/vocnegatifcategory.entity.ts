import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class VocNegatifCategory {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ApiProperty()
    @Column()
    Category: string;

    @ApiProperty()
    @Column()
    Title: string;

    @ApiProperty()
    @Column()
    Code: string;

    @ApiProperty()
    @Column('simple-array', { nullable: true })
    Problem: string[];

    @ApiProperty()
    @CreateDateColumn()
    created_at: Date; // Creation date

    @ApiProperty()
    @UpdateDateColumn()
    updated_at: Date; // Last updated date


}
