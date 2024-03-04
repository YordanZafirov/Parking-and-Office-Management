import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IsUnique } from '../utils/decorators/unique/unique.decorator';
import { PartialType } from '@nestjs/mapped-types';

class CreateFloorPlanDto {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  @IsUnique({ tableName: 'floor_plan', column: 'name' })
  name: string;

  @IsNotEmpty({ message: 'ImageUrl cannot be empty' })
  @IsString({ message: 'ImageUrl must be a string' })
  imgUrl: string;

  @IsNotEmpty({ message: 'Location cannot be empty' })
  @IsUUID()
  locationId: string;

  @IsNotEmpty()
  @IsUUID()
  modifiedBy: string;
}

class UpdateFloorPlanDto extends PartialType(CreateFloorPlanDto) {}

export { CreateFloorPlanDto, UpdateFloorPlanDto };
