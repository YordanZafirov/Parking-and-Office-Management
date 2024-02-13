import { Module } from '@nestjs/common';
import { UniqueModule } from './utils/decorators/unique/unique.module';
import { IsUniqueConstraint } from './utils/decorators/unique/validator';

@Module({
  imports: [UniqueModule],
  controllers: [],
  providers: [IsUniqueConstraint],
})
export class AppModule {}
