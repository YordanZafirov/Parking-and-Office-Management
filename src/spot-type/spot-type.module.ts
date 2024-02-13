import { Module } from '@nestjs/common';
import { SpotTypeService } from './spot-type.service';
import { SpotTypeController } from './spot-type.controller';

@Module({
  controllers: [SpotTypeController],
  providers: [SpotTypeService],
})
export class SpotTypeModule {}
