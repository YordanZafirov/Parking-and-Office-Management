import { IsUUID, IsNotEmpty } from 'class-validator';

export class FindFreeSpotsDto {
  @IsUUID()
  @IsNotEmpty()
  locationId: string;

  @IsUUID()
  @IsNotEmpty()
  spotTypeId: string;

  @IsNotEmpty()
  startDateTime: Date;

  @IsNotEmpty()
  endDateTime: Date;
}
