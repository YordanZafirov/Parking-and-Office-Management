import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Reservation } from './entities/reservation.entity';

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

  @Post()
  async createFloorPlan(@Body() createFloorPlan: CreateReservationDto) {
    const createdReservations =
      await this.reservationService.create(createFloorPlan);
    return createdReservations;
  }

  @Patch(':id')
  async updateFloorPlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFloorPlanDto: UpdateReservationDto,
  ) {
    const updateReservations = await this.reservationService.update(
      id,
      updateFloorPlanDto,
    );
    return updateReservations;
  }

  @Delete(':id')
  async deleteReservation(@Param('id', ParseUUIDPipe) id: string): Promise<{
    id: string;
    start: Date;
    end: Date;
    comment: string;
    spotId: string;
    userId: string;
    message: string;
  }> {
    return this.reservationService.softDelete(id);
  }
}
