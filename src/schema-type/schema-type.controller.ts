import { Controller, Get, Param } from '@nestjs/common';
import { SchemaTypeService } from './schema-type.service';

@Controller('schema-type')
export class SchemaTypeController {
  constructor(private readonly schemaTypeService: SchemaTypeService) {}

  @Get()
  findAll() {
    return this.schemaTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schemaTypeService.findOne(+id);
  }
}
