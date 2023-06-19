import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Voc } from "./voc.entity";

@Entity()
export class VocNegatif {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ApiProperty()
    @Column()
    CodeOutlet: string;

    @ApiProperty()
    @Column()
    OutletName: string;

    @ApiProperty()
    @Column("text")
    Comment: string;

    @ApiProperty()
    @Column()
    Source: string;

    @ApiProperty()
    @Column({type:'datetime',nullable:true})
    VocDate: Date;

    @ApiProperty()
    @Column({type:'date',nullable:true})
    VocDateOnly: Date;

    @ApiProperty()
    @Column()
    CategoryComplaint: string;

    @ApiProperty()
    @Column()
    SubCategoryComplaint: string;

    @ApiProperty()
    @CreateDateColumn()
    created_at: Date; // Creation date

    @ApiProperty()
    @UpdateDateColumn()
    updated_at: Date; // Last updated date

    @OneToOne(() => Voc, (voc) => voc.vocnegatif) // specify inverse side as a second parameter
    @JoinColumn()
    voc: Voc
}
