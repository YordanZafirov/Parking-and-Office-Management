import { IsUUID, IsNotEmpty } from 'class-validator';

export class FindAllSpotsByTypeAndFloorPlanDto {
  @IsUUID()
  @IsNotEmpty()
  floorPlanId: string;

  @IsUUID()
  @IsNotEmpty()
  spotTypeId: string;
}
