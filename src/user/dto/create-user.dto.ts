import { IsNotEmpty, IsUUID } from 'class-validator';
import { IsYaraEmail } from '../../utils/decorators/user-data/email.decorator';
import { IsUnique } from '../../utils/decorators/unique/unique.decorator';
import { IsStrongPassword } from '../../utils/decorators/user-data/password.decorator';

export class CreateUserDto {
  @IsYaraEmail()
  @IsNotEmpty()
  @IsUnique({ tableName: 'user', column: 'email' })
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsUUID()
  modifiedBy: string;
}
