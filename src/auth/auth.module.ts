import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { Config } from '../helpers/config.helper';
import { AuthController } from './auth.controller';
import { QueryHelper } from 'src/helpers/query.helper';
import { MenuService } from 'src/menu/menu.service';
import { MenuController } from 'src/menu/menu.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: Config.get('SECRET_KEY'),
      signOptions: { expiresIn: Config.get('EXPIRED') },
    }),
  ],
  providers: [AuthService,JwtStrategy,QueryHelper,MenuService],
  exports: [AuthService],
  controllers: [AuthController,MenuController],
})
export class AuthModule {}