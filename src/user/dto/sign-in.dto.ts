import { IsString } from 'class-validator';
import { IsYaraEmail } from 'src/utils/decorators/email/email.decorator';

export class SignInDto {
  @IsYaraEmail()
  email: string;

  @IsString()
  password: string;
}
