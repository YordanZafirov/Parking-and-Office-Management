import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';
import { IsUnique } from '../../utils/decorators/unique/unique.decorator';

class CreateSpotDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 64)
  @IsUnique({ tableName: 'spot', column: 'name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 256)
  description: string;

  @IsNotEmpty()
  top: number;

  @IsNotEmpty()
  left: number;

  @IsUUID()
  @IsNotEmpty()
  spotTypeId: string;

  @IsUUID()
  @IsNotEmpty()
  floorPlanId: string;

  @IsUUID()
  @IsNotEmpty()
  modifiedBy: string;
}

class CreateSpotsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSpotDto)
  markers: CreateSpotDto[];
}

class UpdateSpotDto extends PartialType(
  OmitType(CreateSpotDto, ['floorPlanId'] as const),
) {
  isPermanent: boolean;
}

export { CreateSpotDto, CreateSpotsDto, UpdateSpotDto };
