import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UniqueModule } from './utils/decorators/unique/unique.module';
import { IsUniqueConstraint } from './utils/decorators/unique/validator';

@Module({
  imports: [UniqueModule],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint],
})
export class AppModule {}
