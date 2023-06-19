import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutletsController } from './outlet.controller';
import { Outlet } from './entities/Outlet.entity';
import {OutletsService } from './outlet.service';
import { AuthModule } from 'src/auth/auth.module';
import { District } from './entities/district.entity';
import { Employee } from './entities/employee.entity';

import { GoodsController } from 'src/outlet-goods/outlet-goods.controller';
import { Goods } from 'src/outlet-goods/entities/goods.entity';
import { GoodsService } from 'src/outlet-goods/outlet-goods.service';
import { GoodsOutlet } from 'src/outlet-goods/entities/goodsoutlet.entity';
import { QueryHelper } from 'src/helpers/query.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Outlet,District,Employee,Goods,GoodsOutlet]),
    AuthModule
  ],
  controllers: [OutletsController,GoodsController],
  providers: [OutletsService,GoodsService,QueryHelper]
})
export class OutletsModule {}
