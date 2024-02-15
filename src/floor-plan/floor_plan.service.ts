import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFloorPlanDto } from './dto/create-floor_plan.dto';
import { UpdateFloorPlanDto } from './dto/update-floor_plan.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { FloorPlan } from './entities/floor_plan.entity';
import { EntityManager, Not, Repository } from 'typeorm';
import { validate } from 'class-validator';

@Injectable()
export class FloorPlanService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(FloorPlan)
    private floorPlanRepository: Repository<FloorPlan>,
  ) {}

  async findAll() {
    const floorPlans = await this.floorPlanRepository.find({});
    if (!floorPlans) {
      throw new NotFoundException(`No floor plan found`);
    }
    return floorPlans;
  }

  async findOneById(id: string): Promise<FloorPlan> {
    const existingFloorPlan = await this.floorPlanRepository.findOneBy({ id });
    return existingFloorPlan;
  }

  async create(createFloorPlanDto: CreateFloorPlanDto): Promise<FloorPlan> {
    const errors = await validate(createFloorPlanDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { name, imgUrl, location } = createFloorPlanDto;

    const existingFloorPlan = await this.floorPlanRepository.findOne({
      where: { name },
    });

    if (
      existingFloorPlan &&
      createFloorPlanDto.name === existingFloorPlan.name
    ) {
      throw new BadRequestException(`Floor Plan already exists!`);
    }

    const newFloorPlan = this.floorPlanRepository.create({
      name,
      imgUrl,
      location,
    });

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

    if (!existingFloorPlan) {
      throw new NotFoundException(`Floor Plan with id ${id} not found`);
    }

    await this.floorPlanRepository.softDelete({ id });

    return {
      id,
      name: existingFloorPlan.name,
      imgUrl: existingFloorPlan.imgUrl,
      location: existingFloorPlan.location,
      message: `${id}`,
    };
  }
}
