import { Module } from '@nestjs/common';
import { SpotService } from './spot.service';
import { SpotController } from './spot.controller';
import { Spot } from './spot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpotTypeModule } from '../spot-type/spot-type.module';

@Module({
  imports: [TypeOrmModule.forFeature([Spot]), SpotTypeModule],
  controllers: [SpotController],
  providers: [SpotService],
  exports: [SpotService],
})
export class SpotModule {}
