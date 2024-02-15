import { PartialType } from '@nestjs/mapped-types';
import { CreateFloorPlanDto } from './create-floor_plan.dto';

export class UpdateFloorPlanDto extends PartialType(CreateFloorPlanDto) {}
