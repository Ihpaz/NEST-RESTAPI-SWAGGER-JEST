import { HttpException } from '@nestjs/common';


export class Response {
    message: string;
    data: any;

    constructor(message: string, data: any) {
        this.message = message;
        this.data = data;
    }
}

export class ResponseDatatable {
    data: any[];
    total: number;

    constructor(data: any[], total: number) {
        this.data = data;
        this.total = total;
    }
}

export const response = (message: string, data: any = null) => new Response(message, data);

export const responseDatatable = (data: any[], total: number) => new ResponseDatatable(data, total);



export const responseError = (message: string) => {
    let errorCode: number = 400;
    let errorCodeIndex: number = 0;
    const usingErrorcode = message.includes('#EC');

    if (usingErrorcode) {
        errorCodeIndex = message.indexOf('#EC');
        errorCode = Number(message.substring(errorCodeIndex + 3));
    }
    const finalMessage = (!usingErrorcode) ? message : message.substring(0, errorCodeIndex).trim();
    return Promise.reject(new HttpException({ message: finalMessage }, errorCode));
};
