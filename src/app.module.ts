import { Module } from '@nestjs/common';
import { UniqueModule } from './utils/decorators/unique/unique.module';
import { IsUniqueConstraint } from './utils/decorators/unique/validator';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from './utils/filters/GlobalExceptionFilter';
import { dataSourceOptions } from 'db/data-source';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './utils/guards/auth.guard';
import { AuthModule } from './auth/auth.module';
import { SpotTypeModule } from './spot-type/spot-type.module';
import { SchemaTypeModule } from './schema-type/schema-type.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot(),
    UniqueModule,
    AuthModule,
    SpotTypeModule,
    SchemaTypeModule,
  ],
  controllers: [],
  providers: [
    IsUniqueConstraint,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
