import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFloorPlanDto, UpdateFloorPlanDto } from './floor-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FloorPlan } from './floor_plan.entity';
import { Not, Repository } from 'typeorm';
import { Spot } from '../spot/spot.entity';
import { SpotType } from '../spot-type/entities/spot-type.entity';
import { Location } from '../location/location.entity';

@Injectable()
export class FloorPlanService {
  constructor(
    @InjectRepository(FloorPlan)
    private floorPlanRepository: Repository<FloorPlan>,
  ) {}

  async findAll() {
    const floorPlans = await this.floorPlanRepository.find();
    return floorPlans;
  }

  async findOneById(id: string): Promise<FloorPlan> {
    const existingFloorPlan = await this.floorPlanRepository.findOneBy({ id });
    if (!existingFloorPlan) {
      throw new NotFoundException(`Floor Plan with id: ${id} not found`);
    }
    return existingFloorPlan;
  }

  async findAllBySpotTypeAndLocationId(spotTypeId: string, locationId: string) {
    const getAllBySpotType = this.floorPlanRepository
      .createQueryBuilder('floorPlan')
      .leftJoinAndSelect(
        Location,
        'location',
        'floorPlan.locationId = location.id',
      )
      .leftJoinAndSelect(Spot, 'spot', 'spot.floorPlanId = floorPlan.id')
      .leftJoinAndSelect(SpotType, 'spotType', 'spot.spotTypeId = spotType.id')
      .select('floorPlan', 'spot')
      .where('spot.spotTypeId = :spotTypeId', { spotTypeId: spotTypeId })
      .andWhere('floorPlan.locationId = :locationId', {
        locationId: locationId,
      })
      .getMany();

    return getAllBySpotType;
  }

  async create(createFloorPlanDto: CreateFloorPlanDto): Promise<FloorPlan> {
    const newFloorPlan = this.floorPlanRepository.create(createFloorPlanDto);

    const newCreatedFloorPlan =
      await this.floorPlanRepository.save(newFloorPlan);
    return newCreatedFloorPlan;
  }

  async update(
    id: string,
    updateFloorPlanDto: UpdateFloorPlanDto,
  ): Promise<FloorPlan> {
    const existingFloorPlan = await this.floorPlanRepository.findOneBy({ id });

    if (!existingFloorPlan) {
      throw new NotFoundException(`Floor Plan with id ${id} not found`);
    }

    if (
      updateFloorPlanDto.name &&
      existingFloorPlan.name !== updateFloorPlanDto.name
    ) {
      const duplicateFloorPlan = await this.floorPlanRepository.findOne({
        where: { name: updateFloorPlanDto.name, id: Not(id) },
      });

      if (duplicateFloorPlan) {
        throw new BadRequestException(
          `Floor Plan with name ${updateFloorPlanDto.name} already exists!`,
        );
      }
    }

    const updateResult = await this.floorPlanRepository.update(
      id,
      updateFloorPlanDto,
    );

    if (updateResult.affected === 0) {
      throw new NotFoundException(`Floor Plan with ID ${id} not found`);
    }

    const updatedFloorPlan = await this.floorPlanRepository.findOneBy({ id });
    if (!updatedFloorPlan) {
      throw new NotFoundException(`Updated Floor Plan with ID ${id} not found`);
    }

    return updatedFloorPlan;
  }

  async softDelete(id: string): Promise<{
    id: string;
    name: string;
    imgUrl: string;
    location: string;
    message: string;
  }> {
    const existingFloorPlan = await this.floorPlanRepository.findOneBy({ id });

    await this.floorPlanRepository.softDelete({ id });

    return {
      id,
      name: existingFloorPlan.name,
      imgUrl: existingFloorPlan.imgUrl,
      location: existingFloorPlan.locationId,
      message: `${id}`,
    };
  }
}
