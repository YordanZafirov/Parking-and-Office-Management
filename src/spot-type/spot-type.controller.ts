import { Controller, Get, Param } from '@nestjs/common';
import { SpotTypeService } from './spot-type.service';

@Controller('spot-type')
export class SpotTypeController {
  constructor(private readonly spotTypeService: SpotTypeService) {}

  @Get()
  findAll() {
    return this.spotTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spotTypeService.findOne(+id);
  }
}
