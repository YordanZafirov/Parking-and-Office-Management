import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './reservation.entity';
import { UserModule } from '../user/user.module';
import { SpotModule } from '../spot/spot.module';
import { FloorPlanModule } from '../floor-plan/floor-plan.module';

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
