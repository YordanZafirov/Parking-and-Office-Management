import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private userService: UserService,
  ) {}

  async findAll() {
    const reservations = await this.reservationRepository.find();
    if (!reservations) {
      throw new NotFoundException(`No reservation found`);
    }
    return reservations;
  }

  async findOneById(id: string): Promise<Reservation> {
    const existingreservation = await this.reservationRepository.findOneBy({
      id,
    });
    if (!existingreservation) {
      throw new NotFoundException(`Reservation with id: ${id} not found`);
    }
    return existingreservation;
  }

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const errors = await validate(createReservationDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const user = this.userService.findOneById(createReservationDto.modifiedBy);
    if (user) {
      const { start, end, comment, spotId, userId, modifiedBy } =
        createReservationDto;

      const newFloorPlan = this.reservationRepository.create({
        start,
        end,
        comment,
        spotId,
        userId,
        modifiedBy,
      });

      const newCreatedFloorPlan =
        await this.reservationRepository.save(newFloorPlan);
      return newCreatedFloorPlan;
    }
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const existingReservation = await this.reservationRepository.findOneBy({
      id,
    });

    if (!existingReservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }

    const updateResult = await this.reservationRepository.update(
      id,
      updateReservationDto,
    );

    if (updateResult.affected === 0) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    const updatedFloorPlan = await this.reservationRepository.findOneBy({ id });
    if (!updatedFloorPlan) {
      throw new NotFoundException(
        `Updated Reservation with ID ${id} not found`,
      );
    }

    return updatedFloorPlan;
  }

  async remove(id: string, createReservationDto: CreateReservationDto) {
    const reservation = await this.findOneById(id);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    const user = this.userService.findOneById(createReservationDto.modifiedBy);
    if (user) {
      await this.reservationRepository.softRemove(reservation);
      return { success: true, message: id };
    }
  }

  async softDelete(id: string): Promise<{
    id: string;
    start: Date;
    end: Date;
    comment: string;
    spotId: string;
    userId: string;
    message: string;
  }> {
    const existingReservation = await this.reservationRepository.findOneBy({
      id,
    });

    if (!existingReservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }

    await this.reservationRepository.softDelete({ id });

    return {
      id,
      start: existingReservation.start,
      end: existingReservation.end,
      comment: existingReservation.comment,
      spotId: existingReservation.spotId,
      userId: existingReservation.userId,
      message: `${id}`,
    };
  }
}
