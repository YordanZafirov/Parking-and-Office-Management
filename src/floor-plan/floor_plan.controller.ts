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
import { FloorPlanService } from './floor_plan.service';
import { CreateFloorPlanDto } from './dto/create-floor_plan.dto';
import { UpdateFloorPlanDto } from './dto/update-floor_plan.dto';
import { RolesGuard } from '../utils/guards/roles.guard';
import { Roles } from '../utils/decorators/role/roles.decorator';
import { UserRoles } from '../user/user-role.enum';

@Controller('floor-plan')
@UseGuards(RolesGuard)
export class FloorPlanController {
  constructor(private readonly floorPlanService: FloorPlanService) {}

  @Get()
  async findAll() {
    const floorPlans = await this.floorPlanService.findAll();
    return floorPlans;
  }

  @Get('/search')
  async findAllBySpotTypeAndLocation(
    @Query('spotTypeId') spotTypeId: string,
    @Query('locationId')
    locationId: string,
  ) {
    return await this.floorPlanService.findAllBySpotTypeAndLocationId(
      spotTypeId,
      locationId,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const floorPlan = await this.floorPlanService.findOneById(id);
    return floorPlan;
  }

  @Roles(UserRoles.ADMIN)
  @Post()
  async createFloorPlan(@Body() createFloorPlan: CreateFloorPlanDto) {
    const createdFloorPlan =
      await this.floorPlanService.create(createFloorPlan);
    return createdFloorPlan;
  }

  @Roles(UserRoles.ADMIN)
  @Patch(':id')
  async updateFloorPlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFloorPlanDto: UpdateFloorPlanDto,
  ) {
    const updateFloorPlan = await this.floorPlanService.update(
      id,
      updateFloorPlanDto,
    );
    return updateFloorPlan;
  }

  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  async deleteFloorPlan(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    return this.floorPlanService.softDelete(id);
  }
}
