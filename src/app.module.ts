import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

import { BooksModule } from './books/books.module';
import { DatabaseModule } from './config/database/database.module';
import { OutletsModule } from './outlet/outlet.module';
import { GeneralModule } from './general/general.module';
import { UserroleModule } from './userrole/userrole.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { GoodsController } from './outlet-goods/outlet-goods.controller';
import { OutletsController } from './outlet/outlet.controller';
import { UserroleController } from './userrole/userrole.controller';
import { GeneralController } from './general/general.controller';
import { FormModule } from './form/form.module';
import { VocModule } from './voc/voc.module';
import Cryptr from 'cryptr';


@Module({
  
  imports: [
    BooksModule,
    DatabaseModule,
    AuthModule,
    OutletsModule,
    GeneralModule,
    UserroleModule,
    FormModule,
    VocModule
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(AuthMiddleware)
        .exclude( { path: 'Api/v1/userrole', method: RequestMethod.POST },)
        .forRoutes(
          GoodsController,
          OutletsController,
          UserroleController,
          GeneralController
        );
  }

}
