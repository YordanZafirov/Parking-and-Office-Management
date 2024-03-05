import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IsYaraEmail } from 'src/utils/decorators/user-data/email.decorator';
import { IsUnique } from 'src/utils/decorators/unique/unique.decorator';
import { IsStrongPassword } from 'src/utils/decorators/user-data/password.decorator';
import { OmitType, PartialType } from '@nestjs/mapped-types';

class CreateUserDto {
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

class SignInDto {
  @IsYaraEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}

class UpdatePasswordDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'modifiedBy'] as const),
) {
  @IsStrongPassword()
  @IsNotEmpty()
  newPassword: string;
}

class UpdateProfilePictureDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'modifiedBy', 'password'] as const),
) {
  @IsNotEmpty()
  @IsString({ message: 'ImageUrl must be a string' })
  imgUrl: string;
}

export { CreateUserDto, SignInDto, UpdatePasswordDto, UpdateProfilePictureDto };
