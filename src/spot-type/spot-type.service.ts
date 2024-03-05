import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpotType } from './entities/spot-type.entity';
import { Repository } from 'typeorm';
import { CreateSpotTypeDto } from './dto/create-spot-type.dto';
import { UserService } from '../user/user.service';
import { LocationService } from '../location/location.service';
import { FloorPlan } from '../floor-plan/floor-plan.entity';
import { Spot } from '../spot/spot.entity';

@Injectable()
export class SpotTypeService {
  constructor(
    @InjectRepository(SpotType) private repo: Repository<SpotType>,
    private readonly userService: UserService,
    private readonly locationService: LocationService,
  ) {}

  async findAll() {
    const spotType = await this.repo.find();
    if (!spotType) {
      throw new NotFoundException(
        `There are no spot type records in the database`,
      );
    }

    return spotType;
  }

  async findOne(id: string) {
    const spotType = await this.repo.findOneBy({ id });
    if (!spotType) {
      throw new NotFoundException(`Spot type with id: ${id} not found`);
    }
    return spotType;
  }

  async findAllByLocationId(id: string) {
    const location = await this.locationService.findOne(id);

    const getAllByLocation = this.repo
      .createQueryBuilder('spotType')
      .leftJoinAndSelect(Spot, 'spot', 'spot.spotTypeId = spotType.id')
      .leftJoinAndSelect(
        FloorPlan,
        'floorPlan',
        'spot.floorPlanId = floorPlan.id',
      )
      .select('spotType', 'spot')
      .where('floorPlan.locationId = :locationId', { locationId: location.id })
      .getMany();

    return getAllByLocation;
  }

  async create(createSpotTypeDto: CreateSpotTypeDto) {
    const user = await this.userService.findOneById(
      createSpotTypeDto.modifiedBy,
    );

    if (user) {
      const spotType = this.repo.create(createSpotTypeDto);

      return await this.repo.save(spotType);
    }
  }
}
