import { Test, TestingModule } from '@nestjs/testing';
import { VocController } from './voc.controller';
import { VocService } from './voc.service';

describe('VocController', () => {
  let controller: VocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VocController],
      providers: [VocService],
    }).compile();

    controller = module.get<VocController>(VocController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
