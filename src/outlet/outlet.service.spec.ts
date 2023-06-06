import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../config/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { OutletsService } from './outlet.service';
import { Outlet } from './entities/Outlet.entity';
import { OutletDto } from './dto/Outlet.dto';
import { OutletDatatableDTO } from './dto/Outletdatatable.dto';
import { arrayBuffer } from 'stream/consumers';
import { async } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

// describe('OutletsService', () => {
//   let service: OutletsService;
//   let id:number=1;
//   let OutletDto:OutletDto= {
//     Author: "Ihpaz",
//     Title: "Fiqih",
//     Ayod: 1289,
//     Tags: [
//       "FiQIH",
//       "Sunnah"
//     ],
//     Publisher: ["Pustaka Sunnah","Syiar"]
//   }

//   let OutletDatatable:any={ 
//     take: 0, 
//     skip: 0 ,
//     OrderByAuthor:'DESC',
//   }  

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports:[ 
//       DatabaseModule,
//       TypeOrmModule.forFeature([Outlet]),
//       AuthModule],
//       providers: [OutletsService],
//     }).compile();

//     service = module.get<OutletsService>(OutletsService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   it('should be created Outlet', async () => {
//         const data=await service.create(OutletDto);
//         id=data['id'];
//         expect(data).toMatchObject(OutletDto)
//   });


//   it('should be get pagination Outlet', async () => {
//     const param:OutletDatatableDTO=OutletDatatable;
//     const data=await service.findAll(param);
//     expect(data).toHaveProperty('data')
//     expect(data).toHaveProperty('limit')
//     expect(data).toHaveProperty('skip')
//     expect(data).toHaveProperty('count')
//   });


//   it('should be get detail Outlet', async () => {
//       const data=await service.findOne(id);
//       expect(data).toMatchObject(OutletDto)
//   });


//   it('should be updated Outlet', async () => {
//     OutletDto.Author='Muhamad Ihpaz Ramadhan';
//     const data=await service.update(id,OutletDto);
//     expect(data).toHaveProperty('Author','Muhamad Ihpaz Ramadhan')
//   });

//   it('should be deleted Outlet and not found', async () => {
//     const data=await service.remove(id);
//     expect(data).toHaveProperty('message','deleted successfully')
//     await expect(service.findOne(id)).rejects.toThrowError(NotFoundException)
//   });

  
// });
