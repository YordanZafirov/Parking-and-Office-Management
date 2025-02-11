import { FloorPlanService } from '../floor-plan/floor-plan.service';
import { SpotService } from './../spot/spot.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto, CreateReservationsDto } from './reservation.dto';
import { Reservation } from './reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { Spot } from '../spot/spot.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private userService: UserService,
    private spotService: SpotService,
    private floorPlanService: FloorPlanService,
  ) {}

  async findAll() {
    const reservations = await this.reservationRepository.find();
    return reservations;
  }
  async findAllFuture() {
    const currentDateTime = new Date();
    const reservations = await this.findAllByCondition({
      start: MoreThanOrEqual(currentDateTime),
    });
    if (!reservations) {
      throw new NotFoundException(`No reservations found`);
    }
    return reservations;
  }
  async findAllCurrentAndFuture() {
    const currentDateTime = new Date();
    const reservations = await this.findAllByCondition({
      end: MoreThanOrEqual(currentDateTime),
    });
    if (!reservations) {
      throw new NotFoundException(`No reservations found`);
    }
    return reservations;
  }

  async findAllByCondition(condition: any) {
    if (!condition) return null;
    const reservations = await this.reservationRepository.find({
      where: condition,
      order: {
        start: 'DESC',
      },
    });
    return reservations;
  }

  async findAllBySpotId(spotId: string) {
    const currentDateTime = new Date();
    const reservations = await this.findAllByCondition({
      spotId,
      end: MoreThanOrEqual(currentDateTime),
    });
    return reservations;
  }

  async findAllCurrentAndFutureByUserId(userId: string) {
    const currentDateTime = new Date();
    const reservations = await this.findAllByCondition({
      userId,
      end: MoreThanOrEqual(currentDateTime),
    });
    return reservations;
  }
  async findAllPastByUserId(userId: string) {
    const currentDateTime = new Date();
    const reservations = await this.findAllByCondition({
      userId,
      end: LessThanOrEqual(currentDateTime),
    });
    return reservations;
  }
  async findAllCurrentByUserId(userId: string) {
    const currentDateTime = new Date();
    const reservations = await this.findAllByCondition({
      userId,
      start: LessThanOrEqual(currentDateTime),
      end: MoreThanOrEqual(currentDateTime),
    });
    return reservations;
  }
  async findAllFutureByUserId(userId: string) {
    const currentDateTime = new Date();
    const reservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.userId = :userId', { userId })
      .andWhere('reservation.start >= :currentDateTime', { currentDateTime })
      .orderBy('reservation.start', 'ASC')
      .getMany();
    return reservations;
  }
  async findAllByUserId(userId: string) {
    const reservations = await this.findAllByCondition({
      userId,
    });
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
  async checkReservation(createReservationDto: CreateReservationDto) {
    await this.userService.findOneById(createReservationDto.modifiedBy);

    const spot = await this.spotService.findOne(createReservationDto.spotId);
    await this.checkIfSpotIsPermanent(spot);
    const existingSpotReservations = await this.findAllBySpotId(
      createReservationDto.spotId,
    );
    await this.checkIfSpotHasReservation(
      createReservationDto,
      existingSpotReservations,
    );
    const existingUserReservations = await this.findAllCurrentAndFutureByUserId(
      createReservationDto.userId,
    );
    await this.checkIfUserHasReservation(
      spot,
      createReservationDto,
      existingUserReservations,
    );

    const newReservation =
      this.reservationRepository.create(createReservationDto);

    return newReservation;
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

      const existingUserReservations =
        await this.findAllCurrentAndFutureByUserId(dtoRe.userId);
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

  async softDelete(id: string) {
    const existingReservation = await this.reservationRepository.findOneBy({
      id,
    });

    if (!existingReservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }

    await this.reservationRepository.softDelete({ id });

    return { id };
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
      const reFloorPlan = await this.floorPlanService.findOneById(
        reSpot.floorPlanId,
      );
      const dtoFloorPlan = await this.floorPlanService.findOneById(
        dtoSpot.floorPlanId,
      );

      if (
        (dtoStart.getTime() > reStart.getTime() &&
          dtoStart.getTime() < reEnd.getTime() &&
          (dtoSpot.spotTypeId === reSpot.spotTypeId ||
            reFloorPlan.locationId !== dtoFloorPlan.locationId)) ||
        (dtoEnd.getTime() > reStart.getTime() &&
          dtoEnd.getTime() < reEnd.getTime() &&
          (dtoSpot.spotTypeId === reSpot.spotTypeId ||
            reFloorPlan.locationId !== dtoFloorPlan.locationId)) ||
        (dtoStart.getTime() === reStart.getTime() &&
          dtoEnd.getTime() === reEnd.getTime() &&
          (dtoSpot.spotTypeId === reSpot.spotTypeId ||
            reFloorPlan.locationId !== dtoFloorPlan.locationId))
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
        (dtoStart.getTime() > reStart.getTime() &&
          dtoStart.getTime() < reEnd.getTime()) ||
        (dtoEnd.getTime() > reStart.getTime() &&
          dtoEnd.getTime() < reEnd.getTime()) ||
        (dtoStart.getTime() === reStart.getTime() &&
          dtoEnd.getTime() === reEnd.getTime())
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
