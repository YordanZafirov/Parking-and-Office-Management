import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
// import { CreateReservationDto } from './dto/create-reservation.dto';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationsDto } from './dto/create-multiple-reservations.dto';

@Controller('reservation')
@UseGuards(RolesGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  async findAll() {
    const reservations = await this.reservationService.findAll();
    return reservations;
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const reservation = await this.reservationService.findOneById(id);
    return reservation;
  }
  @Get('by-spot/:spotId')
  async findAllBySpot(@Param('spotId') spotId: string): Promise<Reservation[]> {
    return await this.reservationService.findAllBySpotId(spotId);
  }
  @Get('by-user/:userId')
  async findAllByUser(@Param('userId') userId: string): Promise<Reservation[]> {
    return await this.reservationService.findAllByUserId(userId);
  }

  @Post('create-multiple')
  async createMultiple(@Body() createReservationsDto: CreateReservationsDto) {
    return await this.reservationService.createMultiple(createReservationsDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return this.reservationService.softDelete(id);
  }
}
// @Post()
// async create(@Body() createReservationDto: CreateReservationDto) {
//   const createdReservations =
//     await this.reservationService.create(createReservationDto);
//   return createdReservations;
// }
