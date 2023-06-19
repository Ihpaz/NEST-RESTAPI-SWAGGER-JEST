export class CreateVocNegatifDto {

    id: number;

    Voc:VocNegatif[];

    FilterDate : Date;
}


export class VocNegatif{

    OutletName : string;

    Comment : string;

    VocDate : Date;

    Source : string;

    CategoryComplaint : string;

    SubCategoryComplaint : string;

    Category: string;

}
