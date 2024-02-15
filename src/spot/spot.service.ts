import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Spot } from './entities/spot.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SpotService {
  constructor(
    @InjectRepository(Spot)
    private readonly spotRepository: Repository<Spot>,
    private readonly userService: UserService,
  ) {}

  async findAll() {
    const spots = await this.spotRepository.find();
    return spots;
  }

  async findOne(id: string) {
    if (!id) {
      return null;
    }
    const spot = await this.spotRepository.findOne({
      where: { id },
    });
    if (!spot) {
      throw new NotFoundException('Spot not found');
    }
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

    await this.userService.findOneById(modifiedBy);

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

      await this.userService.findOneById(modifiedBy);

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
    await this.userService.findOneById(updateSpotDto.modifiedBy);
    const spot = await this.findOne(id);
    if (!spot) {
      throw new NotFoundException(`Spot with id ${id} not found`);
    }
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
}
