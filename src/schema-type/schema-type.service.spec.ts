import { Test, TestingModule } from '@nestjs/testing';
import { SchemaTypeService } from './schema-type.service';

describe('SchemaTypeService', () => {
  let service: SchemaTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchemaTypeService],
    }).compile();

    service = module.get<SchemaTypeService>(SchemaTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
