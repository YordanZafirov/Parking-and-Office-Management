import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import {
  CreateUserDto,
  UpdatePasswordDto,
  UpdateProfilePictureDto,
} from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.role', 'ASC')
      .getMany();
    return users;
  }

  async findOneById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }
    return user;
  }
  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);

    const createdUser = await this.userRepository.save(user);
    return createdUser;
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findOneById(id);

    Object.assign(user, updatePasswordDto);
    const result = await this.userRepository.save(user);
    return result;
  }
  async updateProfilePicture(
    id: string,
    updateProfilePictureDto: UpdateProfilePictureDto,
  ) {
    const user = await this.findOneById(id);
    Object.assign(user, updateProfilePictureDto);
    await this.userRepository.save(user);
    return { message: 'Profile picture updated successfully' };
  }

  async remove(id: string) {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.softRemove(user);
    return { success: true, message: id };
  }
}
