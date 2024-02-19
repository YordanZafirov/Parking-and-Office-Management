import { Module } from '@nestjs/common';
import { FloorPlanService } from './floor_plan.service';
import { FloorPlanController } from './floor_plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FloorPlan } from './entities/floor_plan.entity';
import { UserModule } from 'src/user/user.module';
import { SpotTypeModule } from 'src/spot-type/spot-type.module';
import { LocationModule } from 'src/location/location.module';

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
