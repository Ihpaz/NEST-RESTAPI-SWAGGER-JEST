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
import { UserRole } from 'src/userrole/entities/userrole.entity';
import { RoleOutlet } from 'src/userrole/entities/roleoutlet.entity';
import { Form } from 'src/form/entities/Form.entity';
import { FormQuestions } from 'src/form/entities/FormQuestions.entity';
import { FormAnswers } from 'src/form/entities/FormAnswers.entity';
import { FormOptions } from 'src/form/entities/FormOptions.entity';
import { FormOptionsAnswer } from 'src/form/entities/FormOptionsAnswer.entity';
import { Voc } from 'src/voc/entities/voc.entity';
import { VocNegatif } from 'src/voc/entities/vocnegatif.entity';
import { VocNegatifCategory } from 'src/voc/entities/vocnegatifcategory.entity';


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
                    entities: [Book,User,Menu,Outlet,District,Employee,Goods,
                               GoodsOutlet,UserRole,RoleOutlet,Form,FormQuestions,FormAnswers,
                               FormOptions,FormOptionsAnswer,Voc,VocNegatif,VocNegatifCategory
                    ],
                    // entities: [
                    //    '../../**/*.entity{.ts,.js}',
                    // ],
                    // autoLoadEntities: true,
                    synchronize: true,
                    logging:false,
                    connectionTimeout: 10000,
                    requestTimeout: 10000,
                    pool: {
                        max: 10,
                    }
                    
                };
            },
        }),
    ],
})

export class DatabaseModule { }
