import { Module } from '@nestjs/common';
import { IsUniqueConstraint } from './validator';

@Module({
  providers: [IsUniqueConstraint],
  exports: [IsUniqueConstraint],
})
export class UniqueModule {}
