import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateProfilePictureDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'modifiedBy', 'password'] as const),
) {
  @IsNotEmpty()
  @IsString({ message: 'ImageUrl must be a string' })
  imgUrl: string;
}
