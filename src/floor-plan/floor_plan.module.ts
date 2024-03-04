import { Module } from '@nestjs/common';
import { FloorPlanService } from './floor_plan.service';
import { FloorPlanController } from './floor_plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FloorPlan } from './floor_plan.entity';
import { UserModule } from '../user/user.module';
import { SpotTypeModule } from '../spot-type/spot-type.module';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FloorPlan]),
    UserModule,
    SpotTypeModule,
    LocationModule,
  ],
  controllers: [FloorPlanController],
  providers: [FloorPlanService],
  exports: [FloorPlanService],
})
export class FloorPlanModule {}
