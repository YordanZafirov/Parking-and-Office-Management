import { Test, TestingModule } from '@nestjs/testing';
import { SchemaTypeController } from './schema-type.controller';
import { SchemaTypeService } from './schema-type.service';

describe('SchemaTypeController', () => {
  let controller: SchemaTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchemaTypeController],
      providers: [SchemaTypeService],
    }).compile();

    controller = module.get<SchemaTypeController>(SchemaTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
