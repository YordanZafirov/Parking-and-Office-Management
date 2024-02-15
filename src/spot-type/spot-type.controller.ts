import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SpotTypeService } from './spot-type.service';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { UserRoles } from 'src/user/user-role.enum';
import { Roles } from 'src/utils/decorators/role/roles.decorator';
import { CreateSpotTypeDto } from './dto/create-spot-type.dto';

@UseGuards(RolesGuard)
@Controller('spot-type')
export class SpotTypeController {
  constructor(private readonly spotTypeService: SpotTypeService) {}

  @Get()
  async findAll() {
    return await this.spotTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.spotTypeService.findOne(id);
  }

  @Roles(UserRoles.ADMIN)
  @Post()
  async create(@Body() createSpotTypeDto: CreateSpotTypeDto) {
    return await this.spotTypeService.create(createSpotTypeDto);
  }
}
