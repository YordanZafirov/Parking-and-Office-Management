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
  Query,
} from '@nestjs/common';
import { SpotService } from './spot.service';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/role/roles.decorator';
import { UserRoles } from 'src/user/user-role.enum';
import { CreateSpotsDto } from './dto/create-multiple-spots.dto';
import { CreateSpotDto } from './dto/create-spot.dto';

@Controller('spot')
@UseGuards(RolesGuard)
export class SpotController {
  constructor(private readonly spotService: SpotService) {}

  @Get()
  async findAll() {
    return await this.spotService.findAll();
  }

  @Get('by-floorPlan')
  async findByFloorPlanId(
    @Query('floorPlanId')
    floorPlanId: string,
  ) {
    return await this.spotService.findAllSpotsByFloorPlanId(floorPlanId);
  }

  @Get('by-location-and-type/search')
  async findAllSpotsByTypeAndLocation(
    @Query('locationId')
    locationId: string,
    @Query('spotTypeId') spotTypeId: string,
  ) {
    return await this.spotService.findAllSpotsByTypeAndLocationId(
      locationId,
      spotTypeId,
    );
  }

  @Get('by-type-and-floorplan/search')
  async findAllSpotsByTypeAndFloorPlan(
    @Query('floorPlanId')
    floorPlanId: string,
    @Query('spotTypeId') spotTypeId: string,
  ) {
    return await this.spotService.findAllSpotsByTypeAndFloorPlan(
      floorPlanId,
      spotTypeId,
    );
  }

  @Get('by-type-and-location-free/search')
  async findFreeSpotsByTypeAndLocationAndPeriod(
    @Query('floorPlanId')
    floorPlanId: string,
    @Query('spotTypeId') spotTypeId: string,
    @Query('startDateTime') startDateTime: Date,
    @Query('endDateTime') endDateTime: Date,
  ) {
    return await this.spotService.findFreeSpotsByTypeAndLocationAndPeriod(
      floorPlanId,
      spotTypeId,
      startDateTime,
      endDateTime,
    );
  }
  @Get('by-type-and-location-occupancy/search')
  async getOccupancyPercentageByLocationAndTypeAndPeriod(
    @Query('locationId')
    locationId: string,
    @Query('spotTypeId') spotTypeId: string,
    @Query('startDateTime') startDateTime: Date,
    @Query('endDateTime') endDateTime: Date,
  ) {
    return await this.spotService.getOccupancyPercentageByLocationAndTypeAndPeriod(
      locationId,
      spotTypeId,
      startDateTime,
      endDateTime,
    );
  }

  @Get('by-type-and-floor-plan-combination/search')
  async findFreeSpotsCombinationByTypeAndFloorPlanAndPeriod(
    @Query('floorPlanId')
    floorPlanId: string,
    @Query('spotTypeId') spotTypeId: string,
    @Query('startDateTime') startDateTime: Date,
    @Query('endDateTime') endDateTime: Date,
  ) {
    return await this.spotService.findFreeSpotsCombinationByTypeAndFloorPlanAndPeriod(
      floorPlanId,
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
  @Post('/check')
  async check(@Body() createSpotDto: CreateSpotDto) {
    return await this.spotService.checkSpot(createSpotDto);
  }
}
