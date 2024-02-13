import { Module } from '@nestjs/common';
import { UniqueModule } from './utils/decorators/unique/unique.module';
import { IsUniqueConstraint } from './utils/decorators/unique/validator';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './utils/filters/GlobalExceptionFilter';

@Module({
  imports: [UniqueModule],
  controllers: [],
  providers: [
    IsUniqueConstraint,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
