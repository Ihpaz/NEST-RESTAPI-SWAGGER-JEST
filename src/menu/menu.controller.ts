import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { responseError } from "src/helpers/response.helper";
import { MenuService } from "./menu.service";

@ApiTags('menu')
@Controller('Api/v1/menu')
export class MenuController {
    constructor(
        private readonly MenuService: MenuService
    ){

    }

    @Post('get-menu')
    async getMenu(@Body() dto:any){
        try {
            const menu= await this.MenuService.getMenu(dto.app);
            return menu;
        } catch (error) {
            responseError(error.message)
        }
    }
}
