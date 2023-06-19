import { JwtService } from '@nestjs/jwt';
import { Config } from './config.helper';
import { isError } from './error.helper';
import { QueryHelper } from 'src/helpers/query.helper';
import { DataSource } from 'typeorm';

export async function getAuth(
    token: string,
    latLong: any = null,
    dataSource
): Promise<Auth> {
    const jwtOptions = {
        secret: Config.get('SECRET_KEY'),
        signOptions: { expiresIn: Config.get('EXPIRED') },
    };

   
   
    const jwtService = new JwtService(jwtOptions),
        decodeToken = jwtService.verify(token);

        const  latitude = null,
        longitude =  null;

        // const queryHelper: QueryHelper = new QueryHelper(dataSource);
        // const data =await queryHelper.getOne(
        //     `SELECT Role 
        //      FROM user a INNER JOIN user_role b on a.userroleid=b.id
        //      WHERE a.username=:userId
        //      `,{
        //         userId:  decodeToken.userId
        //      });
    
             let role:string='';
        //    if(data){
        //         role = data.Role;
        //    }
         

        return new Auth(
            decodeToken.userId,
            decodeToken.CodeOutlet,
            latitude,
            longitude,
            token,
            role
        );
    
    
   
}



export class Auth {
    userId: string;
    CodeOutlet: string;
    latitude: any;
    longitude: any;
    latLong: string;
    token: string;
    userRole:string;
  

    constructor(
        userId: string,
        CodeOutlet: string,
        latitude: any,
        longitude: any,
        token: string,
        userRole: string
       
    ) {
        this.userId = userId;
        this.CodeOutlet = CodeOutlet;
        this.latitude = latitude;
        this.longitude = longitude;
        this.latLong = `${latitude},${longitude}`;
        this.token = token;
        this.userRole = userRole
    }


   
  
    isUserRoleExist(roles: any[], fEmpRoleSAM: number) {
        const filterRoles = roles.filter((item: any) => {
            return item.fEmpRoleSAM === fEmpRoleSAM;
        });
        return filterRoles.length ? true : false;
    }
}
