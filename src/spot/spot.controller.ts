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

@Controller('spot')
@UseGuards(RolesGuard)
export class SpotController {
  constructor(private readonly spotService: SpotService) {}

  @Get()
  async findAll() {
    return await this.spotService.findAll();
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
}
// @Roles(UserRoles.ADMIN)
// @Post()
// async create(@Body() createSpotDto: CreateSpotDto) {
//   return await this.spotService.create(createSpotDto);
// }
