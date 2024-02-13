import { Module } from '@nestjs/common';
import { SchemaTypeService } from './schema-type.service';
import { SchemaTypeController } from './schema-type.controller';

@Module({
  controllers: [SchemaTypeController],
  providers: [SchemaTypeService],
})
export class SchemaTypeModule {}
