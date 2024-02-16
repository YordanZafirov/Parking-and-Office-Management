import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateReservationDto } from './create-reservation.dto';

export class CreateReservationsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReservationDto)
  reservations: CreateReservationDto[];
}
