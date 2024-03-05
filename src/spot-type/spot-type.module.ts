import { Module } from '@nestjs/common';
import { SpotTypeService } from './spot-type.service';
import { SpotTypeController } from './spot-type.controller';
import { SpotType } from './spot-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SpotType])],
  controllers: [SpotTypeController],
  providers: [SpotTypeService],
  exports: [SpotTypeService],
})
export class SpotTypeModule {}
