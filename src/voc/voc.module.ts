import { Module } from '@nestjs/common';
import { VocService } from './voc.service';
import { VocController } from './voc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Voc } from './entities/voc.entity';
import { QueryHelper } from 'src/helpers/query.helper';
import { VocNegatif } from './entities/vocnegatif.entity';
import { VocNegatifCategory } from './entities/vocnegatifcategory.entity';
import { PdfService } from 'src/general/pdf.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Voc,VocNegatif,VocNegatifCategory]),
    AuthModule
  ],
  controllers: [VocController],
  providers: [VocService,QueryHelper,PdfService]
})
export class VocModule {}
