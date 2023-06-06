import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

import { BooksModule } from './books/books.module';
import { DatabaseModule } from './config/database/database.module';
import { OutletsModule } from './outlet/outlet.module';


@Module({
  
  imports: [
    BooksModule,
    DatabaseModule,
    AuthModule,
    OutletsModule
  ]
})
export class AppModule {}
