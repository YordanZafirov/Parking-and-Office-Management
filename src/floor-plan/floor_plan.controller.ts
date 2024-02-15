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
import { FloorPlanService } from './floor_plan.service';
import { CreateFloorPlanDto } from './dto/create-floor_plan.dto';
import { UpdateFloorPlanDto } from './dto/update-floor_plan.dto';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/role/roles.decorator';
import { UserRoles } from 'src/user/user-role.enum';

@Controller('floor-plan')
@UseGuards(RolesGuard)
export class FloorPlanController {
  constructor(private readonly floorPlanService: FloorPlanService) {}

  @Get()
  async getAllFloorPlans() {
    const floorPlans = await this.floorPlanService.findAll();
    return { data: floorPlans };
  }

  @Get(':id')
  async getFloorPlanById(@Param('id', ParseUUIDPipe) id: string) {
    const floorPlan = await this.floorPlanService.findOneById(id);
    return { data: floorPlan };
  }

  @Roles(UserRoles.ADMIN)
  @Post()
  async createFloorPlan(@Body() createFloorPlan: CreateFloorPlanDto) {
    const createdFloorPlan =
      await this.floorPlanService.create(createFloorPlan);
    return { data: createdFloorPlan };
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
    return { data: updateFloorPlan };
  }

  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  async deleteFloorPlan(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    return this.floorPlanService.softDelete(id);
  }
}
