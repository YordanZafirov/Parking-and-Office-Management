import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsUnique } from 'src/utils/decorators/unique/unique.decorator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsUnique({ tableName: 'user', column: 'email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
