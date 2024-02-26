import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './entities/reservation.entity';
import { UserModule } from 'src/user/user.module';
import { SpotModule } from 'src/spot/spot.module';
import { FloorPlanModule } from 'src/floor-plan/floor_plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    UserModule,
    SpotModule,
    FloorPlanModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
