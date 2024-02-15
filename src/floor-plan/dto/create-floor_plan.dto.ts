import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
import { IsUnique } from '../../utils/decorators/unique/unique.decorator';

export class CreateFloorPlanDto {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  @Matches(/^[A-Za-z0-9\s\-]+$/, {
    message: 'Name must contain only letters and numbers',
  })
  @IsUnique({ tableName: 'floor_plan', column: 'name' })
  name: string;

  @IsNotEmpty({ message: 'ImageUrl cannot be empty' })
  @IsString({ message: 'ImageUrl must be a string' })
  imgUrl: string;

  @IsNotEmpty({ message: 'Locaton cannot be empty' })
  @IsUUID()
  locationId: string;

  @IsNotEmpty()
  @IsUUID()
  modifiedBy: string;
}
