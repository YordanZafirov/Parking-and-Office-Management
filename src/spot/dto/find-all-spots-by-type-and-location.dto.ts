import { IsUUID, IsNotEmpty } from 'class-validator';

export class FindAllSpotsByTypeAndLocationDto {
  @IsUUID()
  @IsNotEmpty()
  locationId: string;

  @IsUUID()
  @IsNotEmpty()
  spotTypeId: string;
}
