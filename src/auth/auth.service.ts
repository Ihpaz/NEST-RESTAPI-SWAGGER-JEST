import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

import { QueryHelper } from 'src/helpers/query.helper';
import { Config } from 'src/helpers/config.helper';
import * as crypto from 'crypto';
import { isError } from 'src/helpers/error.helper';



@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private _queryHelper:QueryHelper,  
    ) {
     
    }

  async validateUser(dto: AuthDTO){

   
    const data = await this._queryHelper.getOne(`
        SELECT 
          u.Username,
          u.Password,
          u.Email,
          u.IsActive,
          ur.role
        FROM user u
        INNER JOIN user_role ur ON u.userroleid=ur.id
        WHERE 
          u.Username=:username
    `,{
        username:dto.Username
      }
    );

    if(!data){
      return false;
    } 
    
    if(data.IsActive && (this.decryptData(data.Password)==dto.Password)){
      return data;
    }


    return false;
           

 
  }

  async login(dto: AuthDTO) {
   try {
    
    const validate: any = await this.validateUser(dto);

    if(!validate){
      isError('Username atau password salah');
    }else{
      const payload = { Email: validate.Email,Username: validate.Username, Role:validate.role };
     
      return {
        response:"Success",
        status:200,
        access_token: this.jwtService.sign(payload),
        data:payload
      };
     
    }
   } catch (error) {
      throw new Error(error.message);
   }
   
    
  }

  encryptData(dataValue: string): string {
    let publicEncrypt: string = '';

    for (let i = 0; i < dataValue.length; i++) {
      const getChr = dataValue[i],
        charCode = getChr.charCodeAt(0),
        fromCharCode = String.fromCharCode(charCode + dataValue.length - 1);
      publicEncrypt += fromCharCode;
    }
  
    return publicEncrypt;
  }

  decryptData(dataValue: string): string {
    let publicDecrypt: string = '';

    for (let i = 0; i < dataValue.length; i++) {
      const getChr = dataValue[i],
        charCode = getChr.charCodeAt(0),
        fromCharCode = String.fromCharCode(charCode - dataValue.length + 1);
      publicDecrypt += fromCharCode;
    }
  
    return publicDecrypt;
  }
}