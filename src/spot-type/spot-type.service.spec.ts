import { Test, TestingModule } from '@nestjs/testing';
import { SpotTypeService } from './spot-type.service';

describe('SpotTypeService', () => {
  let service: SpotTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotTypeService],
    }).compile();

    service = module.get<SpotTypeService>(SpotTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
