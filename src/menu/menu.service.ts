import { Injectable } from "@nestjs/common";
import { response } from "express";

@Injectable()
export class MenuService {
    constructor(){

    }

    getMenu(App:string){
        try {
            
            let sidebar:any[]=[];

            switch(App){
                case 'dc':
                    sidebar = [
                        { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
                        // { path: '/outlet', title: 'Outlet',  icon:'location_on', class: '' },
                        // { path: '/goods', title: 'Goods',  icon:'library_books', class: '' },
                        // { path: '/outlet-asset', title: 'Outlet Goods',  icon:'store', class: '' },
                        { path: '/form', title: 'Form Digital Checklist',  icon:'content_paste', class: '' },
                        // { path: '/voc', title: 'Voice Of Customer',  icon:'record_voice_over', class: '' }
                    ];
                break;
                case 'voc':
                    sidebar = [
                        { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
                        { path: '/voc', title: 'Voice Of Customer',  icon:'record_voice_over', class: '' },
                        { path: '/voc-negatif', title: 'voc Negatif',  icon:'group_remove', class: '' },
                        { path: '/voc-dashboard', title: 'voc Dashboard',  icon:'preview', class: '' }
                    ];
                break;
                default:
                    sidebar = [
                        { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
                        { path: '/outlet', title: 'Outlet',  icon:'location_on', class: '' },
                        { path: '/goods', title: 'Goods',  icon:'library_books', class: '' },
                        { path: '/outlet-asset', title: 'Outlet Goods',  icon:'store', class: '' },
                        // { path: '/form', title: 'Form Digital Checklist',  icon:'content_paste', class: '' },
                        // { path: '/voc', title: 'Voice Of Customer',  icon:'record_voice_over', class: '' }
                    ];
            }

            return sidebar;

        } catch (error) {
            throw new Error(error.message);
        }

    }
}