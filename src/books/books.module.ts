import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from './controller/books.controller';
import { Book } from './entities/book.entity';
import { BooksService } from './services/books.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [BooksService]
})
export class BooksModule {}
