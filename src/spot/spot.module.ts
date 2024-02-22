import { Module } from '@nestjs/common';
import { SpotService } from './spot.service';
import { SpotController } from './spot.controller';
import { Spot } from './entities/spot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { LocationModule } from 'src/location/location.module';
import { SpotTypeModule } from 'src/spot-type/spot-type.module';
import { FloorPlanModule } from 'src/floor-plan/floor_plan.module';

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
