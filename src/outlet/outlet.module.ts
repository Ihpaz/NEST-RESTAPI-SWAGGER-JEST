import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutletsController } from './outlet.controller';
import { Outlet } from './entities/Outlet.entity';
import { OutletsService } from './outlet.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Outlet]),
    AuthModule
  ],
  controllers: [OutletsController],
  providers: [OutletsService]
})
export class OutletsModule {}
