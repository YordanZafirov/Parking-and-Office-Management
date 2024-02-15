import { Module } from '@nestjs/common';
import { SpotService } from './spot.service';
import { SpotController } from './spot.controller';
import { Spot } from './entities/spot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Spot]), UserModule],
  controllers: [SpotController],
  providers: [SpotService],
})
export class SpotModule {}
