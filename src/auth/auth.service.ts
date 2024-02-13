import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    const payload = { sub: user.id, username: user.username, role: user.role };
    const partialUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: partialUser,
    };
  }

  async signup(email: string, username: string, password: string) {
    // See if email is in use
    const userByEmail = await this.userService.findByEmail(email);
    if (userByEmail) {
      throw new BadRequestException('email in use');
    }
    const userByUsername = await this.userService.findByUsername(username);
    if (userByUsername) {
      throw new BadRequestException('username in use');
    }
    // Hash the users password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.userService.create(email, username, result);

    // return the user
    const { id, created, updated, deleted } = user;
    return { id, username, email, created, updated, deleted };
  }
}
