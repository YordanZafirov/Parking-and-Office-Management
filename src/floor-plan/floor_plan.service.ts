import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFloorPlanDto } from './dto/create-floor_plan.dto';
import { UpdateFloorPlanDto } from './dto/update-floor_plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FloorPlan } from './entities/floor_plan.entity';
import { Not, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { SpotTypeService } from '../spot-type/spot-type.service';
import { Spot } from '../spot/entities/spot.entity';
import { SpotType } from '../spot-type/entities/spot-type.entity';
import { LocationService } from '../location/location.service';
import { Location } from '../location/entities/location.entity';

@Injectable()
export class FloorPlanService {
  constructor(
    @InjectRepository(FloorPlan)
    private floorPlanRepository: Repository<FloorPlan>,
    private userService: UserService,
    private spotTypeService: SpotTypeService,
    private locationService: LocationService,
  ) {}

  async findAll() {
    const floorPlans = await this.floorPlanRepository.find();
    if (!floorPlans) {
      throw new NotFoundException(`No floor plan found`);
    }
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
    const spotType = await this.spotTypeService.findOne(spotTypeId);
    const location = await this.locationService.findOne(locationId);
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
      .where('spot.spotTypeId = :spotTypeId', { spotTypeId: spotType.id })
      .andWhere('floorPlan.locationId = :locationId', {
        locationId: location.id,
      })
      .getMany();

    return getAllBySpotType;
  }

  async create(createFloorPlanDto: CreateFloorPlanDto): Promise<FloorPlan> {
    const user = this.userService.findOneById(createFloorPlanDto.modifiedBy);
    if (user) {
      const { name, imgUrl, locationId, modifiedBy } = createFloorPlanDto;

      const newFloorPlan = this.floorPlanRepository.create({
        name,
        imgUrl,
        locationId,
        modifiedBy,
      });

      const newCreatedFloorPlan =
        await this.floorPlanRepository.save(newFloorPlan);
      return newCreatedFloorPlan;
    }
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

    if (!existingFloorPlan) {
      throw new NotFoundException(`Floor Plan with id ${id} not found`);
    }

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
