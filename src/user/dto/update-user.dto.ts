import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';
import { IsStrongPassword } from 'src/utils/decorators/user-data/password.decorator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email'] as const),
) {
  @IsStrongPassword()
  @IsNotEmpty()
  newPassword: string;
}
