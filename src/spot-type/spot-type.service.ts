import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpotType } from './entities/spot-type.entity';
import { Repository } from 'typeorm';
import { CreateSpotTypeDto } from './dto/create-spot-type.dto';

@Injectable()
export class SpotTypeService {
  constructor(@InjectRepository(SpotType) private repo: Repository<SpotType>) {}

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

  async create(createSpotTypeDto: CreateSpotTypeDto) {
    const spotType = this.repo.create(createSpotTypeDto);
    return await this.repo.save(spotType);
  }
}
