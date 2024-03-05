import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpotType } from './spot-type.entity';
import { Repository } from 'typeorm';
import { FloorPlan } from '../floor-plan/floor-plan.entity';
import { Spot } from '../spot/spot.entity';
import { CreateSpotTypeDto } from './spot-type.dto';

@Injectable()
export class SpotTypeService {
  constructor(@InjectRepository(SpotType) private repo: Repository<SpotType>) {}

  async findAll() {
    const spotType = await this.repo.find();
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
    const getAllByLocation = this.repo
      .createQueryBuilder('spotType')
      .leftJoinAndSelect(Spot, 'spot', 'spot.spotTypeId = spotType.id')
      .leftJoinAndSelect(
        FloorPlan,
        'floorPlan',
        'spot.floorPlanId = floorPlan.id',
      )
      .select('spotType', 'spot')
      .where('floorPlan.locationId = :locationId', { locationId: id })
      .getMany();

    return getAllByLocation;
  }

  async create(createSpotTypeDto: CreateSpotTypeDto) {
    const spotType = this.repo.create(createSpotTypeDto);

    return await this.repo.save(spotType);
  }
}
