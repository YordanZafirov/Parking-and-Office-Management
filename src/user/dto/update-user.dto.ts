import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator/types/decorator/decorators';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email'] as const),
) {
  @IsStrongPassword()
  @IsNotEmpty()
  newPassword: string;
}
