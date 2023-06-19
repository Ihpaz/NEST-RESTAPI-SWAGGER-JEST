import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { VocNegatif } from "./vocnegatif.entity";

@Entity()
export class Voc {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ApiProperty()
    @Column()
    CodeOutlet: string;

    @ApiProperty()
    @Column()
    OutletName: string;

    @ApiProperty()
    @Column()
    Menu: string;

    @ApiProperty()
    @Column()
    Suka: number;

    @ApiProperty()
    @Column()
    Rekom: number;

    @ApiProperty()
    @Column()
    Rating: number;

    @ApiProperty()
    @Column("text")
    Saran: string;

    @ApiProperty()
    @Column()
    Source: string;

    @ApiProperty()
    @Column()
    Am: string;

    @ApiProperty()
    @Column()
    Drm: string;

    @ApiProperty()
    @Column({type:'datetime',nullable:true})
    VocDate: Date;

    @ApiProperty()
    @Column()
    Category: string;

    @ApiProperty()
    @CreateDateColumn()
    created_at: Date; // Creation date

    @ApiProperty()
    @UpdateDateColumn()
    updated_at: Date; // Last updated date

    @OneToOne(() => VocNegatif, (vocnegatif) => vocnegatif.voc) // specify inverse side as a second parameter
    vocnegatif: VocNegatif
}
