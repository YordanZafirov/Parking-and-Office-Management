import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { SpotTypeService } from './spot-type.service';
import { RolesGuard } from 'src/utils/guards/roles.guard';

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
}
