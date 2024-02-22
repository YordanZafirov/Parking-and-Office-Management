import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';
import { IsStrongPassword } from 'src/utils/decorators/user-data/password.decorator';

export class UpdatePasswordDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'modifiedBy'] as const),
) {
  @IsStrongPassword()
  @IsNotEmpty()
  newPassword: string;
}
