import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../../books/entities/book.entity';
import { ConfigModule } from '../config.module';
import { ConfigService } from '../config.service';
import { User } from '../../auth/entities/user.entity';
import { Menu } from '../../menu/entities/menu.entity';
import { Outlet } from '../../outlet/entities/Outlet.entity';
import { District } from '../../outlet/entities/district.entity';
import { Employee } from '../../outlet/entities/employee.entity';
import { Goods } from 'src/outlet-goods/entities/goods.entity';
import { GoodsOutlet } from 'src/outlet-goods/entities/goodsoutlet.entity';


//use env for production
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    type: 'mysql',
                    host:config.get('DB_HOST'),
                    port: config.getInt('DB_PORT'),
                    username: config.get('DB_USERNAME'),
                    password: config.get('DB_PASSWORD'), 
                    database: config.get('DB_DATABASE'),
                    entities: [Book,User,Menu,Outlet,District,Employee,Goods,GoodsOutlet],
                    synchronize: true,
                    logging:false
                    
                };
            },
        }),
    ],
})

export class DatabaseModule { }
