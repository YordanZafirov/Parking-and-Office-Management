import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SpotService } from './spot.service';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/role/roles.decorator';
import { UserRoles } from 'src/user/user-role.enum';
import { CreateSpotsDto } from './dto/create-multiple-spots.dto';
import { FindFreeSpotsDto } from './dto/find-free-spots.dto';
import { FindAllSpotsByTypeAndLocationDto } from './dto/find-all-spots-by-type-and-location.dto';
import { CreateSpotDto } from './dto/create-spot.dto';

@Controller('spot')
@UseGuards(RolesGuard)
export class SpotController {
  constructor(private readonly spotService: SpotService) {}

  @Get()
  async findAll() {
    return await this.spotService.findAll();
  }

  @Get('by-type-and-location-all')
  async findAllSpotsByTypeAndLocation(
    @Body()
    findAllSpotsByTypeAndLocationDto: FindAllSpotsByTypeAndLocationDto,
  ) {
    const { locationId, spotTypeId } = findAllSpotsByTypeAndLocationDto;
    return await this.spotService.findAllSpotsByTypeAndLocation(
      locationId,
      spotTypeId,
    );
  }
  @Get('by-type-and-location-free')
  async findFreeSpotsByTypeAndLocationAndPeriod(
    @Body()
    findFreeSpotsDto: FindFreeSpotsDto,
  ) {
    const { locationId, spotTypeId, startDateTime, endDateTime } =
      findFreeSpotsDto;
    return await this.spotService.findFreeSpotsByTypeAndLocationAndPeriod(
      locationId,
      spotTypeId,
      startDateTime,
      endDateTime,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.spotService.findOne(id);
  }

  @Roles(UserRoles.ADMIN)
  @Post()
  async createMultiple(@Body() createSpotsDto: CreateSpotsDto) {
    return await this.spotService.createMultiple(createSpotsDto);
  }

  @Roles(UserRoles.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSpotDto: UpdateSpotDto,
  ) {
    return await this.spotService.update(id, updateSpotDto);
  }

  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.spotService.remove(id);
  }

  @Roles(UserRoles.ADMIN)
  @Post()
  async check(@Body() createSpotDto: CreateSpotDto) {
    return await this.spotService.checkSpot(createSpotDto);
  }
}
