import { Injectable } from '@nestjs/common';
import { CreateUserroleDto } from './dto/create-userrole.dto';
import { UpdateUserroleDto } from './dto/update-userrole.dto';
import { QueryHelper } from 'src/helpers/query.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsOutlet } from 'src/outlet-goods/entities/goodsoutlet.entity';
import { Repository } from 'typeorm';
import { UserRole } from './entities/userrole.entity';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserroleService {
  constructor(
    @InjectRepository(UserRole)
    private UserRoleRepository: Repository<UserRole>,
    @InjectRepository(User)
    private UserRepository: Repository<User>,
    private _queryHelper:QueryHelper,
    private AuthService:AuthService
  ){}
  async create(dto: CreateUserroleDto) {

    dto.Password=await this.AuthService.encryptData(dto.Password);
    const result= await this.UserRepository.save(dto)
    return result;
  }

  findAll() {
    return `This action returns all userrole`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userrole`;
  }

  update(id: number, updateUserroleDto: UpdateUserroleDto) {
    return `This action updates a #${id} userrole`;
  }

  remove(id: number) {
    return `This action removes a #${id} userrole`;
  }
}
