import { Module } from '@nestjs/common';
import { FloorPlanService } from './floor-plan.service';
import { FloorPlanController } from './floor-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FloorPlan } from './floor-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FloorPlan])],
  controllers: [FloorPlanController],
  providers: [FloorPlanService],
  exports: [FloorPlanService],
})
export class FloorPlanModule {}
