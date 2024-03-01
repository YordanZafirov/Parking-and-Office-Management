import { IsNotEmpty, IsUUID } from 'class-validator';
import { IsYaraEmail } from 'src/utils/decorators/user-data/email.decorator';
import { IsUnique } from 'src/utils/decorators/unique/unique.decorator';
import { IsStrongPassword } from 'src/utils/decorators/user-data/password.decorator';

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
