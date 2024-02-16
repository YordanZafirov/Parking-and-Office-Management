import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Spot } from './entities/spot.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateSpotsDto } from './dto/create-multiple-spots.dto';

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
}

// async create(createSpotDto: CreateSpotDto) {
//   const { modifiedBy } = createSpotDto;

//   await this.userService.findOneById(modifiedBy);

//   const spot = this.spotRepository.create(createSpotDto);

//   const createdSpot = await this.spotRepository.save(spot);
//   return createdSpot;
// }
