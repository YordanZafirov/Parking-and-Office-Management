import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Spot } from './entities/spot.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpotService {
  constructor(
    @InjectRepository(Spot)
    private readonly spotRepository: Repository<Spot>,
  ) {}

  async findAll() {
    return await this.spotRepository.find();
  }

  async findOne(id: string) {
    if (!id) {
      return null;
    }
    const spot = await this.spotRepository.findOne({
      where: { id },
    });
    return spot;
  }

  async create(createSpotDto: CreateSpotDto) {
    const {
      name,
      description,
      top,
      left,
      spotTypeId,
      floorPlanId,
      modifiedBy,
    } = createSpotDto;

    const spot = this.spotRepository.create({
      name,
      description,
      top,
      left,
      spotTypeId,
      floorPlanId,
      modifiedBy,
    });

    const createdSpot = await this.spotRepository.save(spot);
    return createdSpot;
  }
  async createMultiple(createSpotDto: CreateSpotDto[]) {
    const spots = [];
    for (const sp of createSpotDto) {
      const {
        name,
        description,
        top,
        left,
        spotTypeId,
        floorPlanId,
        modifiedBy,
      } = sp;

      const spot = this.spotRepository.create({
        name,
        description,
        top,
        left,
        spotTypeId,
        floorPlanId,
        modifiedBy,
      });

      const createdSpot = await this.spotRepository.save(spot);
      spots.push(createdSpot);
    }
    return spots;
  }

  async update(id: string, updateSpotDto: UpdateSpotDto) {
    const spot = await this.findOne(id);
    if (!spot) {
      throw new NotFoundException(`Spot with id ${id} not found`);
    }
    Object.assign(spot, updateSpotDto);
    return this.spotRepository.save(spot);
  }

  async remove(id: string) {
    const spot = await this.findOne(id);

    if (!spot) {
      throw new NotFoundException('Spot not found');
    }

    await this.spotRepository.softRemove(spot);
    return { success: true, message: id };
  }
}
