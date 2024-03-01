import { IsYaraEmail } from '../../utils/decorators/user-data/email.decorator';
import { IsStrongPassword } from '../../utils/decorators/user-data/password.decorator';

export class SignInDto {
  @IsYaraEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
