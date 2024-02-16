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
import { UserService } from 'src/user/user.service';
import { CreateReservationsDto } from './dto/create-multiple-reservations.dto';
import { Spot } from 'src/spot/entities/spot.entity';

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

  async createMultiple(createReservationsDto: CreateReservationsDto) {
    const reservations = [];
    const { modifiedBy } = createReservationsDto.reservations[0];
    await this.userService.findOneById(modifiedBy);

    for (const dtoRe of createReservationsDto.reservations) {
      const dtoSpot = await this.spotService.findOne(dtoRe.spotId);
      await this.checkIfSpotIsPermanent(dtoSpot);

      const existingSpotReservations = await this.findAllBySpotId(dtoRe.spotId);
      await this.checkIfSpotHasReservation(dtoRe, existingSpotReservations);

      const existingUserReservations = await this.findAllByUserId(dtoRe.userId);
      await this.checkIfUserHasReservation(
        dtoSpot,
        dtoRe,
        existingUserReservations,
      );

      const newReservation = this.reservationRepository.create(dtoRe);

      reservations.push(newReservation);
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

  async softDelete(id: string): Promise<string> {
    const existingReservation = await this.reservationRepository.findOneBy({
      id,
    });

    if (!existingReservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }

    await this.reservationRepository.softDelete({ id });

    return id;
  }

  async checkIfUserHasReservation(
    dtoSpot: Spot,
    dtoRe: CreateReservationDto,
    existingUserReservations: Reservation[],
  ) {
    for (const re of existingUserReservations) {
      const reSpot = await this.spotService.findOne(re.spotId);
      const reStart = new Date(re.start);
      const reEnd = new Date(re.end);
      const dtoStart = new Date(dtoRe.start);
      const dtoEnd = new Date(dtoRe.end);

      if (
        (dtoStart.getTime() >= reStart.getTime() &&
          dtoStart.getTime() <= reEnd.getTime() &&
          dtoSpot.spotTypeId === reSpot.spotTypeId) ||
        (dtoEnd.getTime() >= reStart.getTime() &&
          dtoEnd.getTime() <= reEnd.getTime() &&
          dtoSpot.spotTypeId === reSpot.spotTypeId)
      ) {
        throw new BadRequestException(
          'This user already has reservation for that period',
        );
      }
    }
  }

  async checkIfSpotHasReservation(
    dtoRe: CreateReservationDto,
    existingSpotReservations: Reservation[],
  ) {
    for (const re of existingSpotReservations) {
      const reStart = new Date(re.start);
      const reEnd = new Date(re.end);
      const dtoStart = new Date(dtoRe.start);
      const dtoEnd = new Date(dtoRe.end);

      if (
        (dtoStart.getTime() >= reStart.getTime() &&
          dtoStart.getTime() <= reEnd.getTime()) ||
        (dtoEnd.getTime() >= reStart.getTime() &&
          dtoEnd.getTime() <= reEnd.getTime())
      ) {
        throw new BadRequestException(
          'This spot is already reserved for that period',
        );
      }
    }
  }

  async checkIfSpotIsPermanent(dtoSpot: Spot) {
    if (dtoSpot.isPermanent) {
      throw new BadRequestException('This spot is marked as permanently used');
    }
  }
}
// async create(
//   createReservationDto: CreateReservationDto,
// ): Promise<Reservation> {
//   await this.userService.findOneById(createReservationDto.modifiedBy);

//   const spot = await this.spotService.findOne(createReservationDto.spotId);
//   if (spot.isPermanent) {
//     throw new BadRequestException('This spot is marked as permanently used');
//   }
//   const existingSpotReservations = await this.findAllBySpotId(
//     createReservationDto.spotId,
//   );

//   for (const re of existingSpotReservations) {
//     const reStart = new Date(re.start);
//     const reEnd = new Date(re.end);
//     const dtoStart = new Date(createReservationDto.start);
//     const dtoEnd = new Date(createReservationDto.end);

//     if (
//       (dtoStart.getTime() >= reStart.getTime() &&
//         dtoStart.getTime() <= reEnd.getTime()) ||
//       (dtoEnd.getTime() >= reStart.getTime() &&
//         dtoEnd.getTime() <= reEnd.getTime())
//     ) {
//       throw new BadRequestException(
//         'Reservation in this period already exists',
//       );
//     }
//   }

//   const newReservation =
//     this.reservationRepository.create(createReservationDto);

//   const createdReservation =
//     await this.reservationRepository.save(newReservation);
//   return createdReservation;
// }
