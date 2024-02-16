import { SpotService } from './../spot/spot.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { UserService } from 'src/user/user.service';
import { CreateReservationsDto } from './dto/create-multiple-reservations.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private userService: UserService,
    private spotService: SpotService,
  ) {}

  async findAll() {
    const reservations = await this.reservationRepository.find();
    if (!reservations) {
      throw new NotFoundException(`No reservation found`);
    }
    return reservations;
  }

  async findOneById(id: string): Promise<Reservation> {
    const existingReservation = await this.reservationRepository.findOneBy({
      id,
    });
    if (!existingReservation) {
      throw new NotFoundException(`Reservation with id: ${id} not found`);
    }
    return existingReservation;
  }

  async findAllByCondition(condition: any) {
    if (!condition) return null;
    const reservations = await this.reservationRepository.find({
      where: condition,
    });
    return reservations;
  }

  async findAllBySpotId(spotId: string) {
    const reservations = await this.findAllByCondition({ spotId });
    return reservations;
  }

  async findAllByUserId(userId: string) {
    const reservations = await this.findAllByCondition({ userId });
    return reservations;
  }

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const errors = await validate(createReservationDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    await this.userService.findOneById(createReservationDto.modifiedBy);

    const spot = await this.spotService.findOne(createReservationDto.spotId);
    if (spot.isPermanent) {
      throw new BadRequestException('This spot is marked as permanently used');
    }
    const existingReservations = await this.findAllBySpotId(
      createReservationDto.spotId,
    );

    for (const re of existingReservations) {
      const reStart = new Date(re.start);
      const reEnd = new Date(re.end);
      const dtoStart = new Date(createReservationDto.start);
      const dtoEnd = new Date(createReservationDto.end);

      if (
        (dtoStart.getTime() >= reStart.getTime() &&
          dtoStart.getTime() <= reEnd.getTime()) ||
        (dtoEnd.getTime() >= reStart.getTime() &&
          dtoEnd.getTime() <= reEnd.getTime())
      ) {
        throw new BadRequestException(
          'Reservation in this period already exists',
        );
      }
    }

    const { start, end, comment, spotId, userId, modifiedBy } =
      createReservationDto;

    const newReservation = this.reservationRepository.create({
      start,
      end,
      comment,
      spotId,
      userId,
      modifiedBy,
    });

    return newReservation;
  }

  async createMultiple(createReservationsDto: CreateReservationsDto) {
    const reservations = [];
    const { modifiedBy } = createReservationsDto.reservations[0];
    await this.userService.findOneById(modifiedBy);
    for (const re of createReservationsDto.reservations) {
      const reservation = this.create(re);

      reservations.push(reservation);
    }
    const createdReservations = [];
    for (const reservation of reservations) {
      const createdReservation =
        await this.reservationRepository.save(reservation);
      createdReservations.push(createdReservation);
    }

    return createdReservations;
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
