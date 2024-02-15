import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location) private repo: Repository<Location>,
    private readonly userService: UserService,
  ) {}

  async findAll() {
    const locations = await this.repo.find();
    if (!locations) {
      throw new NotFoundException(`There are no locations in the database`);
    }

    return locations;
  }

  async findOne(id: string) {
    const location = await this.repo.findOneBy({ id });
    if (!location) {
      throw new NotFoundException(`Location with id: ${id} not found`);
    }
    return location;
  }

  async create(createLocationDto: CreateLocationDto) {
    const user = this.userService.findOneById(createLocationDto.modifiedBy);

    if (user) {
      const location = this.repo.create(createLocationDto);
      return await this.repo.save(location);
    }
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    const location = await this.findOne(id);

    Object.assign(location, updateLocationDto);
    return await this.repo.save(location);
  }

  async delete(id: string) {
    const location = await this.findOne(id);
    return await this.repo.softRemove(location);
  }
}
