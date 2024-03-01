import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../user/dto/sign-in.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdatePasswordDto } from '../user/dto/update-password.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.userService.findOneByEmail(email);

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    const partialUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: partialUser,
    };
  }

  async signup(createUserDto: CreateUserDto) {
    const { email, password, modifiedBy } = createUserDto;

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    const user = await this.userService.create({
      email,
      password: result,
      modifiedBy,
    });

    const { id, createdAt, updatedAt, deletedAt } = user;
    return { id, email, createdAt, updatedAt, deletedAt };
  }
  async changePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const { password, newPassword } = updatePasswordDto;

    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const currentHash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== currentHash.toString('hex')) {
      throw new NotFoundException('Current password is incorrect');
    }
    const newSalt = randomBytes(8).toString('hex');
    const newHash = (await scrypt(newPassword, newSalt, 32)) as Buffer;
    const newHashString = newSalt + '.' + newHash.toString('hex');
    updatePasswordDto.password = newHashString;
    await this.userService.update(id, updatePasswordDto);

    return { message: 'Password updated successfully' };
  }
}
