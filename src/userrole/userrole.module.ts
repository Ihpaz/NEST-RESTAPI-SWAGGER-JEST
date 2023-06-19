import { Module } from '@nestjs/common';
import { UserroleService } from './userrole.service';
import { UserroleController } from './userrole.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRole } from './entities/userrole.entity';
import { User } from 'src/auth/entities/user.entity';
import { QueryHelper } from 'src/helpers/query.helper';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,UserRole]),
    AuthModule
  ],
  controllers: [UserroleController],
  providers: [UserroleService,QueryHelper]
})
export class UserroleModule {}
