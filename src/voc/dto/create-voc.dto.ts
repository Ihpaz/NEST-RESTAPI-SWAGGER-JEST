export class CreateVocDto {

    id: number;

    Voc:Voc[]
}


export class Voc{

    OutletName : string;

    Menu : string;

    Suka : number;

    Rekom : number;

    Rating : number;

    Saran : string;

    VocDate : Date;

    Source : string;

    Am : string;

    Drm : string;

    Category: string;

}
