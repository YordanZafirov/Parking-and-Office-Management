import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateSpotDto } from './create-spot.dto';
export class CreateSpotsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSpotDto)
  markers: CreateSpotDto[];
}
