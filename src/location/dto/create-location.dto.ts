import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { IsUnique } from '../../utils/decorators/unique/unique.decorator';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsUnique({ tableName: 'location', column: 'name' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, {
    message: 'Name is too short',
  })
  @MaxLength(64, {
    message: 'Name is too long',
  })
  name: string;

  @IsNotEmpty()
  @IsString({ message: 'City must be a string' })
  @MinLength(2, {
    message: 'City is too short',
  })
  @MaxLength(64, {
    message: 'City is too long',
  })
  city: string;

  @IsNotEmpty()
  @IsString({ message: 'Address must be a string' })
  @MinLength(5, {
    message: 'Address is too short',
  })
  @MaxLength(128, {
    message: 'Address is too long',
  })
  address: string;

  @IsNotEmpty({ message: 'ImageUrl cannot be empty' })
  @IsString({ message: 'ImageUrl must be a string' })
  imgUrl: string;

  @IsNotEmpty()
  @IsUUID()
  modifiedBy: string;
}
