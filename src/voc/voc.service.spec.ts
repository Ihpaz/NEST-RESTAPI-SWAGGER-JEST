import { Test, TestingModule } from '@nestjs/testing';
import { VocService } from './voc.service';

describe('VocService', () => {
  let service: VocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VocService],
    }).compile();

    service = module.get<VocService>(VocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
