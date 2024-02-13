import { Module } from '@nestjs/common';
import { UniqueModule } from './utils/decorators/unique/unique.module';
import { IsUniqueConstraint } from './utils/decorators/unique/validator';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './utils/filters/GlobalExceptionFilter';
import { dataSourceOptions } from 'db/data-source';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot(),
    UniqueModule,
  ],
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
