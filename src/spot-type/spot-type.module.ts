import { Module } from '@nestjs/common';
import { SpotTypeService } from './spot-type.service';
import { SpotTypeController } from './spot-type.controller';
import { SpotType } from './entities/spot-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [TypeOrmModule.forFeature([SpotType]), UserModule, LocationModule],
  controllers: [SpotTypeController],
  providers: [SpotTypeService],
  exports: [SpotTypeService],
})
export class SpotTypeModule {}
