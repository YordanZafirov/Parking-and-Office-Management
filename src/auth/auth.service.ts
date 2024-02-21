import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'src/user/dto/sign-in.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/user/dto/update-password.dto';

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

    // Hash the users password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.userService.create({
      email,
      password: result,
      modifiedBy,
    });

    // return the user
    const { id, createdAt, updatedAt, deletedAt } = user;
    return { id, email, createdAt, updatedAt, deletedAt };
  }
  async changePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const { password, newPassword } = updatePasswordDto;

    // Find the user by id
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
