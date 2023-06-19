import { VocNegatif } from "./create-voc-negatif.dto";

export class UpdateVocNegatifDto {

    id: number;

    Voc:VocNegatif[];

    FilterDate : Date;

    CategoryComplaint : string;

    SubCategoryComplaint : string;
}


