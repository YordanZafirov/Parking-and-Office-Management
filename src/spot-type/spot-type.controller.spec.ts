import { Test, TestingModule } from '@nestjs/testing';
import { SpotTypeController } from './spot-type.controller';
import { SpotTypeService } from './spot-type.service';

describe('SpotTypeController', () => {
  let controller: SpotTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpotTypeController],
      providers: [SpotTypeService],
    }).compile();

    controller = module.get<SpotTypeController>(SpotTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
