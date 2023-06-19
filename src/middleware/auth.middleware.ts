import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { getAuth } from '../helpers/auth.helper';
import { DataSource } from 'typeorm';
// import { ActiveCompanyService } from '../services/active-company.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private dataSource: DataSource) { }

    async use(req: any, res: any, next: any) {
        let authorization = req.header('Authorization') || req.query.access_token;

        const cookies = req.headers.cookie;

        if (cookies) {
            const cookieauthorization = cookies.split(';').find(cookie => cookie.trim().startsWith('Authorization='));

            if (cookieauthorization) {
                if(!authorization) authorization = cookieauthorization.split('=')[1];
            }
        }

        if (!authorization) {
            throw new HttpException({ message: 'Required Access Token' }, 401);
        }

        const latitude = req.header('x-latitude'),
            longitude = req.header('x-longitude');

        const latLong = {
            latitude: latitude ? latitude : null,
            longitude: longitude ? longitude : null,
        };

     
        try {
            // const activeCompanyService = new ActiveCompanyService();
            // await activeCompanyService.isCompanyActive();
            //
            req.auth = await getAuth(authorization, latLong,this.dataSource);
            // throw new HttpException({ message: 'expired token' }, 401);
            next();
        } catch (e) {
            throw new HttpException({ message: e.message }, 401);
        }
    }
}
