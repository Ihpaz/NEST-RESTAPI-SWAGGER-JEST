// import * as mime from 'mime';

export const getMime = (path: string) => {
    const mime = require('mime');
    // mime.getType('txt');
    return mime.getType(path);
}
