import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSpotDto } from './create-spot.dto';

export class UpdateSpotDto extends PartialType(
  OmitType(CreateSpotDto, ['floorPlanId'] as const),
) {
  isPermanent: boolean;
}
