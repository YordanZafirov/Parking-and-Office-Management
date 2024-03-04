import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Spot } from './entities/spot.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateSpotsDto } from './dto/create-multiple-spots.dto';
import { Reservation } from '../reservation/reservation.entity';
import { FloorPlan } from '../floor-plan/floor_plan.entity';
import { CreateSpotDto } from './dto/create-spot.dto';
import { LocationService } from '../location/location.service';
import { FloorPlanService } from '../floor-plan/floor_plan.service';
import { SpotTypeService } from '../spot-type/spot-type.service';

@Injectable()
export class SpotService {
  constructor(
    @InjectRepository(Spot)
    private readonly spotRepository: Repository<Spot>,
    private readonly userService: UserService,
    private spotTypeService: SpotTypeService,
    private locationService: LocationService,
    private floorPlanService: FloorPlanService,
  ) {}

  async findAll() {
    const spots = await this.spotRepository.find();
    return spots;
  }

  async findOne(id: string) {
    if (!id) {
      return null;
    }
    const spot = await this.spotRepository.findOneBy({ id });
    if (!spot) {
      throw new NotFoundException('Spot not found');
    }
    return spot;
  }

  async findAllSpotsByFloorPlanId(floorPlanId: string) {
    await this.floorPlanService.findOneById(floorPlanId);

    const spots = await this.spotRepository.find({
      where: { floorPlanId: floorPlanId },
    });

    return spots;
  }

  async findAllSpotsByTypeAndLocationId(
    locationId: string,
    spotTypeId: string,
  ) {
    await this.locationService.findOne(locationId);
    await this.spotTypeService.findOne(spotTypeId);

    const spots = await this.spotRepository
      .createQueryBuilder('spot')
      .leftJoinAndSelect(
        FloorPlan,
        'floorPlan',
        'spot.floor_plan_id = floorPlan.id',
      )
      .select('spot')
      .where('floorPlan.location_id = :locationId', {
        locationId,
      })
      .andWhere('spot.spot_type_id = :spotTypeId', { spotTypeId })
      .getMany();

    return spots;
  }

  async findAllSpotsByTypeAndFloorPlan(
    floorPlanId: string,
    spotTypeId: string,
  ) {
    await this.floorPlanService.findOneById(floorPlanId);
    await this.spotTypeService.findOne(spotTypeId);

    const spots = await this.spotRepository
      .createQueryBuilder('spot')
      .select('spot')
      .where('spot.floor_plan_id = :floorPlanId', { floorPlanId })
      .andWhere('spot.spot_type_id = :spotTypeId', { spotTypeId })
      .getMany();

    return spots;
  }

  async findFreeSpotsByTypeAndLocationAndPeriod(
    floorPlanId: string,
    spotTypeId: string,
    startDateTime: Date,
    endDateTime: Date,
  ) {
    await this.floorPlanService.findOneById(floorPlanId);
    await this.spotTypeService.findOne(spotTypeId);

    const spots = await this.spotRepository
      .createQueryBuilder('spot')
      .leftJoinAndSelect(
        FloorPlan,
        'floor_plan',
        'spot.floor_plan_id = floor_plan.id',
      )
      .leftJoinAndSelect(Reservation, 'r', 'r.spot_id = spot.id')
      .where('floor_plan.id = :floorPlanId', { floorPlanId })
      .andWhere('spot.spot_type_id = :spotTypeId', { spotTypeId })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from('reservation', 'r')
          .where('r.spot_id = spot.id')
          .andWhere(
            '((r.start > :startDateTime AND r.start < :endDateTime) OR ' +
              '(r.end > :startDateTime AND r.end < :endDateTime) OR ' +
              '(:startDateTime > r.start AND :startDateTime < r.end AND :endDateTime > r.start AND :endDateTime < r.end) OR ' +
              '(r.start = :startDateTime AND r.end = :endDateTime))',
          )
          .getQuery();
        return `NOT EXISTS (${subQuery})`;
      })
      .setParameters({
        startDateTime,
        endDateTime,
      })
      .andWhere('spot.is_permanent = false')
      .getMany();
    return spots;
  }

  async findFreeSpotsCombinationByTypeAndFloorPlanAndPeriod(
    floorPlanId: string,
    spotTypeId: string,
    startDateTime: Date,
    endDateTime: Date,
  ) {
    await this.floorPlanService.findOneById(floorPlanId);
    const spotType = await this.spotTypeService.findOne(spotTypeId);
    const daysWithFreeSpot = [];
    const currentSpotWithDates = [];
    if (spotType.name === 'Office desk' || spotType.name === 'Parking place') {
      const currentDate = new Date(startDateTime);
      const endDate = new Date(endDateTime);
      const startDateTimeNext = new Date(startDateTime);
      startDateTimeNext.setDate(startDateTimeNext.getDate() + 1);
      if (startDateTimeNext.getTime() >= endDate.getTime()) {
        throw new NotFoundException(
          'Sorry, there are no free spots for that period of time',
        );
      }
      let counter = 0;
      while (currentDate.getTime() <= endDate.getTime()) {
        counter++;
        const endDateForDay = new Date(currentDate);
        endDateForDay.setDate(endDateForDay.getDate() + 1);
        const spots = await this.findFreeSpotsByTypeAndLocationAndPeriod(
          floorPlanId,
          spotTypeId,
          currentDate,
          endDateForDay,
        );
        if (spots.length === 0) {
          throw new NotFoundException(
            'Sorry, there are no free spots for that period of time',
          );
        }
        if (counter === 1) {
          currentSpotWithDates.push({
            start: new Date(currentDate),
            end: new Date(endDateForDay),
            spot: spots[0],
          });
        } else {
          if (spots[0].id === currentSpotWithDates[0].spot.id) {
            currentSpotWithDates[0].end = new Date(endDateForDay);
          } else {
            daysWithFreeSpot.push({
              start: currentSpotWithDates[0].start,
              end: currentSpotWithDates[0].end,
              spot: currentSpotWithDates[0].spot,
            });
            currentSpotWithDates[0].start = new Date(currentDate);
            currentSpotWithDates[0].end = new Date(endDateForDay);
            currentSpotWithDates[0].spot = spots[0];
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      if (currentSpotWithDates) {
        daysWithFreeSpot.push({
          start: currentSpotWithDates[0].start,
          end: currentSpotWithDates[0].end,
          spot: currentSpotWithDates[0].spot,
        });
      }
    }
    if (
      spotType.name === 'Phone booth' ||
      spotType.name === 'Conference room'
    ) {
      throw new NotFoundException(
        'Sorry, there are no free spots for that period of time',
      );
    }

    return daysWithFreeSpot;
  }

  async countAllSpotsByTypeAndLocationId(
    locationId: string,
    spotTypeId: string,
  ) {
    await this.locationService.findOne(locationId);
    await this.spotTypeService.findOne(spotTypeId);

    const count = await this.spotRepository
      .createQueryBuilder('spot')
      .leftJoinAndSelect(
        FloorPlan,
        'floorPlan',
        'spot.floor_plan_id = floorPlan.id',
      )
      .select('spot')
      .where('floorPlan.location_id = :locationId', {
        locationId,
      })
      .andWhere('spot.spot_type_id = :spotTypeId', { spotTypeId })
      .getCount();

    return count;
  }

  async countFreeSpotsByTypeAndLocationAndPeriod(
    locationId: string,
    spotTypeId: string,
    startDateTime: Date,
    endDateTime: Date,
  ) {
    await this.locationService.findOne(locationId);
    await this.spotTypeService.findOne(spotTypeId);

    const freeSpotsCount = await this.spotRepository
      .createQueryBuilder('spot')
      .leftJoinAndSelect(
        FloorPlan,
        'floor_plan',
        'spot.floor_plan_id = floor_plan.id',
      )
      .leftJoinAndSelect(Reservation, 'r', 'r.spot_id = spot.id')
      .where('floor_plan.location_id = :locationId', { locationId })
      .andWhere('spot.spot_type_id = :spotTypeId', { spotTypeId })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from('reservation', 'r')
          .where('r.spot_id = spot.id')
          .andWhere(
            '((r.start > :startDateTime AND r.start < :endDateTime) OR ' +
              '(r.end > :startDateTime AND r.end < :endDateTime) OR ' +
              '(:startDateTime > r.start AND :startDateTime < r.end AND :endDateTime > r.start AND :endDateTime < r.end) OR ' +
              '(r.start = :startDateTime AND r.end = :endDateTime))',
          )
          .getQuery();
        return `NOT EXISTS (${subQuery})`;
      })
      .setParameters({
        startDateTime,
        endDateTime,
      })
      .andWhere('spot.is_permanent = false')
      .getCount();

    return freeSpotsCount;
  }

  async getOccupancyPercentageByLocationAndTypeAndPeriod(
    locationId: string,
    spotTypeId: string,
    startDateTime: Date,
    endDateTime: Date,
  ) {
    const allSpots = await this.countAllSpotsByTypeAndLocationId(
      locationId,
      spotTypeId,
    );
    const freeSpots = await this.countFreeSpotsByTypeAndLocationAndPeriod(
      locationId,
      spotTypeId,
      startDateTime,
      endDateTime,
    );

    const percentage = ((allSpots - freeSpots) / allSpots) * 100;
    return percentage;
  }

  async createMultiple(createSpotsDto: CreateSpotsDto) {
    const spots = [];
    const { modifiedBy } = createSpotsDto.markers[0];
    await this.userService.findOneById(modifiedBy);
    for (const sp of createSpotsDto.markers) {
      const spot = this.spotRepository.create(sp);

      const createdSpot = await this.spotRepository.save(spot);
      spots.push(createdSpot);
    }
    return spots;
  }

  async update(id: string, updateSpotDto: UpdateSpotDto) {
    await this.userService.findOneById(updateSpotDto.modifiedBy);
    const spot = await this.findOne(id);
    Object.assign(spot, updateSpotDto);
    const updatedSpot = await this.spotRepository.save(spot);
    return updatedSpot;
  }

  async remove(id: string) {
    const spot = await this.findOne(id);

    if (!spot) {
      throw new NotFoundException('Spot not found');
    }

    await this.spotRepository.softRemove(spot);
    return { success: true, message: id };
  }

  async checkSpot(createSpotDto: CreateSpotDto) {
    const { modifiedBy } = createSpotDto;

    await this.userService.findOneById(modifiedBy);
    const spot = this.spotRepository.create(createSpotDto);

    return spot;
  }
}
