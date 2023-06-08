import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

import { BooksModule } from './books/books.module';
import { DatabaseModule } from './config/database/database.module';
import { OutletsModule } from './outlet/outlet.module';
import { GeneralModule } from './general/general.module';


@Module({
  
  imports: [
    BooksModule,
    DatabaseModule,
    AuthModule,
    OutletsModule,
    GeneralModule
  ]
})
export class AppModule {}
