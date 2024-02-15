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
import { Roles } from 'src/utils/decorators/role/roles.decorator';
import { UserRoles } from 'src/user/user-role.enum';

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

  @Roles(UserRoles.ADMIN)
  @Post()
  async createFloorPlan(@Body() createFloorPlan: CreateReservationDto) {
    const createdReservations =
      await this.reservationService.create(createFloorPlan);
    return createdReservations;
  }

  @Roles(UserRoles.ADMIN)
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

  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.reservationService.remove(id);
  }
}
