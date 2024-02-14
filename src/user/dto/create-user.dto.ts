import { IsNotEmpty, IsString } from 'class-validator';
import { IsYaraEmail } from 'src/utils/decorators/email/email.decorator';
import { IsUnique } from 'src/utils/decorators/unique/unique.decorator';

export class CreateUserDto {
  @IsYaraEmail()
  @IsNotEmpty()
  @IsUnique({ tableName: 'user', column: 'email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
