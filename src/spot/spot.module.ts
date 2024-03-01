import { Module } from '@nestjs/common';
import { SpotService } from './spot.service';
import { SpotController } from './spot.controller';
import { Spot } from './entities/spot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { LocationModule } from '../location/location.module';
import { SpotTypeModule } from '../spot-type/spot-type.module';
import { FloorPlanModule } from '../floor-plan/floor_plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Spot]),
    UserModule,
    LocationModule,
    SpotTypeModule,
    FloorPlanModule,
  ],
  controllers: [SpotController],
  providers: [SpotService],
  exports: [SpotService],
})
export class SpotModule {}
