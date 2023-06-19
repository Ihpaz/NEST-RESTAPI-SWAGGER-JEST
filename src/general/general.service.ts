import { Injectable } from "@nestjs/common";
import { join } from 'path';
import { Config } from '../helpers/config.helper';
import { getMime } from "../helpers/mime.helper";

import * as fs from 'fs';

@Injectable()
export class GeneralService {
    constructor(){

    }

    async upload(attachment: any[]) {
        try {
            const result: any = {
                url: '',
                filename: '',
            };

            let isEmpty=false;

            for(const dt of attachment){
                if(dt.size==0){
                    isEmpty=true;
                }
            }

            if (attachment.length && !isEmpty) {
                const attFile = attachment[0];
                const filename = attFile.filename;
                const appMode = Config.get('APP_MODE'),
                    pathFolderTemp = appMode === 'dev' ? '../../files/' : '../files/',
                    pathCurrentFile = join(__dirname, `${pathFolderTemp}${filename}`),
                    pathRealUpload = join(`${Config.get('FOLDER_UPLOAD')}${Config.get('TEMP_RAW_PATH_FILE')}/`, filename);
               

                const rawPathLs = Config.get('TEMP_RAW_PATH_FILE').split('/');
               
                let rawPathURL = Config.get('FOLDER_UPLOAD');
                for (const fd of rawPathLs) {
                    rawPathURL += fd;
                    fs.mkdirSync(rawPathURL, { recursive: true })
                    rawPathURL += '/';
                }

                const pathLs = Config.get('TEMP_PATH_FILE').split('/');
              
                let pathURL =Config.get('FOLDER_UPLOAD');
                for (const fd of pathLs) {
                    pathURL += fd;
                    fs.mkdirSync(pathURL, { recursive: true })
                    pathURL += '/';
                }

                fs.copyFileSync(pathCurrentFile, pathRealUpload);
                if (fs.existsSync(pathRealUpload)) fs.unlinkSync(pathCurrentFile)
                result.filename = filename;
                result.url = `${Config.get('BASE_URL')}general/view-file?path=Temp&filename=${filename}`;
            }

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async viewFile( pathRaw: string, empId: string, filename: string) {
        try {
            const path = join(`upload${pathRaw}/Doc/${empId.toUpperCase()}/`, filename),
                mimeFile = getMime(path),
                file = fs.readFileSync(path);

            return {
                mime: mimeFile,
                file: file,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    
}