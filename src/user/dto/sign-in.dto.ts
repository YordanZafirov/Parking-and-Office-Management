import { IsYaraEmail } from 'src/utils/decorators/user-data/email.decorator';
import { IsStrongPassword } from 'src/utils/decorators/user-data/password.decorator';

export class SignInDto {
  @IsYaraEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
