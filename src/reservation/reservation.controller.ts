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
import { RolesGuard } from '../utils/guards/roles.guard';
import { Reservation } from './reservation.entity';
import { CreateReservationDto, CreateReservationsDto } from './reservation.dto';

@Controller('reservation')
@UseGuards(RolesGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  async findAll() {
    const reservations = await this.reservationService.findAll();
    return reservations;
  }
  @Get('future')
  async findAllFuture() {
    const reservations = await this.reservationService.findAllFuture();
    return reservations;
  }
  @Get('current-and-future')
  async findAllCurrentAndFuture() {
    const reservations =
      await this.reservationService.findAllCurrentAndFuture();
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
  @Get('by-user-future/:userId')
  async findAllFutureByUser(
    @Param('userId') userId: string,
  ): Promise<Reservation[]> {
    return await this.reservationService.findAllFutureByUserId(userId);
  }
  @Get('by-user-past/:userId')
  async findAllPastByUser(
    @Param('userId') userId: string,
  ): Promise<Reservation[]> {
    return await this.reservationService.findAllPastByUserId(userId);
  }
  @Get('by-user-current/:userId')
  async findAllCurrentByUser(
    @Param('userId') userId: string,
  ): Promise<Reservation[]> {
    return await this.reservationService.findAllCurrentByUserId(userId);
  }

  @Post('check')
  async check(@Body() createReservationDto: CreateReservationDto) {
    return await this.reservationService.checkReservation(createReservationDto);
  }

  @Post('create-multiple')
  async createMultiple(@Body() createReservationsDto: CreateReservationsDto) {
    return await this.reservationService.createMultiple(createReservationsDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationService.softDelete(id);
  }
}
