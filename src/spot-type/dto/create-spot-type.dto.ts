import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsUnique } from 'src/utils/decorators/unique/unique.decorator';

export class CreateSpotTypeDto {
  @IsNotEmpty()
  @IsUnique({ tableName: 'spot_type', column: 'name' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, {
    message: 'Name is too short',
  })
  @MaxLength(64, {
    message: 'Name is too long',
  })
  name: string;

  @IsNotEmpty()
  @IsUUID()
  modifiedBy: string;
}
