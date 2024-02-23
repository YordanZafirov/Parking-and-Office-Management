import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Spot } from './entities/spot.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateSpotsDto } from './dto/create-multiple-spots.dto';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { FloorPlan } from 'src/floor-plan/entities/floor_plan.entity';
import { CreateSpotDto } from './dto/create-spot.dto';
import { LocationService } from 'src/location/location.service';
import { FloorPlanService } from 'src/floor-plan/floor_plan.service';
import { SpotTypeService } from 'src/spot-type/spot-type.service';

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

    console.log(spots);

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
      .andWhere(
        '(r.start > :endDateTime OR r.end < :startDateTime OR r IS NULL)',
        {
          endDateTime,
          startDateTime,
        },
      )
      .getMany();

    return spots;
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
