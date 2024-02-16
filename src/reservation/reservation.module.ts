import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './entities/reservation.entity';
import { UserModule } from 'src/user/user.module';
import { SpotModule } from 'src/spot/spot.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), UserModule, SpotModule],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
