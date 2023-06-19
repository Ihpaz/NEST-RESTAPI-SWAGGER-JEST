// import { dateFormat } from './date.helper';

import { dateMoment } from './date.helper';
import { getConnection } from 'typeorm';
import { Config } from './config.helper';
import { join } from 'path';
import * as fs from 'fs';
import { async } from 'rxjs';


export const createAutoNumber =  (count) =>  {
    // Convert the count to a string
    let countStr = count.toString();
   
    // Calculate the number of leading zeros needed
    let leadingZerosCount = 3 - countStr.length;

  
    // Add leading zeros if necessary
    if (leadingZerosCount > 0) {
      countStr = '0'.repeat(leadingZerosCount) + countStr;
    }
  
    return countStr;
}

export const generateFilename = (req: any, file: any, callback: any) => {
    // const auth: Auth = req.auth;
    // const name = file.originalname.split('.')[0];
    // let formatImage = file.originalname.split('.').pop();
    // if (formatImage === 'blob') formatImage = 'jpg';

    let MIMETypes = {
        'text/plain': 'txt',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/msword': 'doc',
        'application/pdf': 'pdf',
        'image/jpeg': 'jpeg',
        'image/gif': 'gif',
        'image/bmp': 'bmp',
        'image/png': 'png',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'application/rtf': 'rtf',
        'application/vnd.ms-powerpoint': 'ppt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
        'video/mp4':'mp4',
        'video/3gpp':'3gp'
    };

    let formatImage = MIMETypes.hasOwnProperty(file.mimetype) ? MIMETypes[file.mimetype] : 'jpeg',
        formatDate = dateMoment().format('YYYYMMDD'),
        formatTime = dateMoment().format('HHmmss');

    formatImage = formatImage === 'png' ? 'jpeg' : formatImage;
    // callback(null, `${auth.userId}_${formatDate}_${formatTime}.${formatImage}`);
    callback(null, `${formatDate}_${formatTime}.${formatImage}`);
};

export const generateFilenames = (req: any, file: any, callback: any) => {
    // const auth: Auth = req.auth;
    // let formatImage = file.originalname.split('.').pop();
    // if (formatImage === 'blob') formatImage = 'jpg';
    let lastIndex =file.originalname.lastIndexOf("."); 
    let name= file.originalname.substring(0,lastIndex)
    // let name = file.originalname.split('.')[0];

    let replaceObj = {
        '&':'dan',
        '#':' ',
        '%':'',
        ',':'_'
    };
    

    name = replaceString(name, replaceObj);
    name = name.replace(/[*|+\?;:'"\{\}\[\]\\\/]/gi, '');

    let MIMETypes = {
        'text/plain': 'txt',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/msword': 'doc',
        'application/pdf': 'pdf',
        'image/jpeg': 'jpeg',
        'image/gif': 'gif',
        'image/bmp': 'bmp',
        'image/png': 'png',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'application/rtf': 'rtf',
        'application/vnd.ms-powerpoint': 'ppt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
        'video/mp4':'mp4',
        'video/3gpp':'3gp'
    };

    let formatImage = MIMETypes.hasOwnProperty(file.mimetype) ? MIMETypes[file.mimetype] : 'jpeg',
        formatDate = dateMoment().format('YYYYMMDD'),
        formatTime = dateMoment().format('HHmmss');

    formatImage = formatImage === 'png' ? 'jpeg' : formatImage;
    // callback(null, `${auth.userId}_${formatDate}_${formatTime}.${formatImage}`);
    callback(null, `${name}_${formatDate}_${formatTime}.${formatImage}`);
};


// export const moveFile = async (auth: Auth, userId: string, filename: string, fromId: string = null) => {
//     try {
//         const fromPath = fromId ? fromId.toUpperCase() : userId.toUpperCase();
//         const pathRaw = join(`${auth.setupApp.FolderUploadSrvESS}${Config.get('TEMP_RAW_PATH_FILE')}${fromPath}/`, filename),
//             path = join(`${auth.setupApp.FolderUploadSrvESS}${Config.get('TEMP_PATH_FILE')}${userId.toUpperCase()}/`, filename);
//         if (fs.existsSync(pathRaw)) fs.renameSync(pathRaw, path);

//         return true;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };

// export const logAction = async (auth: Auth, action: string, startTime: string, endTime: string) => {
//     try {
//         // const manager = getConnection().createQueryRunner().manager;
//         // await manager.query(
//         //     `INSERT INTO TLogDuration (EmpID, LogAction, StartTime, EndTime) VALUES
//         //         ('${auth.userId}', '${action}', '${startTime}', '${endTime}');`
//         // );
//         return true;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };






export const replaceString = (str: string, replaceObj: object) => {
    var reg = new RegExp(Object.keys(replaceObj).join("|"),"gi");

    return str.replace(reg, function(matched){
        return replaceObj[matched];
    });
};