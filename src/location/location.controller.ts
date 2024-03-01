import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UserRoles } from 'src/user/user-role.enum';
import { Roles } from 'src/utils/decorators/role/roles.decorator';
import { RolesGuard } from 'src/utils/guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  async findAll() {
    return await this.locationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.locationService.findOne(id);
  }

  @Roles(UserRoles.ADMIN)
  @Post()
  async create(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationService.create(createLocationDto);
  }

  @Roles(UserRoles.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return await this.locationService.update(id, updateLocationDto);
  }

  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.locationService.delete(id);
  }
}
