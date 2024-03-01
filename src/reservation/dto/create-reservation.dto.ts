import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty({ message: 'Start date cannot be empty' })
  start: Date;

  @IsNotEmpty({ message: 'End date cannot be empty' })
  end: Date;

  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsUUID()
  spotId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  modifiedBy: string;
}
