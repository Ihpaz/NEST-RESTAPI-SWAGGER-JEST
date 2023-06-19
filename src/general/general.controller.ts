import { Controller, Get, Post, Query, Req, Res, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GeneralService } from "./general.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { response, responseError } from "src/helpers/response.helper";
import { diskStorage } from 'multer';
import { generateFilename } from "../helpers/generate.helper";

@ApiTags('General')
@Controller('api/v1/General')
export class GeneralController {
  constructor(private readonly GeneralService: GeneralService) {}

    @Post('upload')
    @UseInterceptors(FilesInterceptor('attachment', 1, {
        storage: diskStorage({
            destination: './files',
            filename: generateFilename,
        }),
    }))
    async upload(
        @Req() req: any,
        @UploadedFiles() attachment: any[],
    ) {
        try {
            console.log('masuk1')
            // const auth: Auth = req.auth;
            const data = await this.GeneralService.upload( attachment);
            return response('success upload', data);
        } catch (error) {
            return responseError(error.message);
        }
    }

    @Get('view-file')
    async viewFile(@Req() req: any, @Res() res: any, @Query() query: any) {
        try {
            
            const getBuffer = await this.GeneralService.viewFile( query.path, query.emp_id, query.filename);
            // res.setHeader('Content-disposition', `attachment;filename=${query.filename}`);
            res.set('Content-Type', getBuffer.mime);
            res.status(200);
            res.send(Buffer.from(getBuffer.file));
            return response('success', query.filename);
        } catch (error) {
            return responseError(error.message);
        }
    }
}

