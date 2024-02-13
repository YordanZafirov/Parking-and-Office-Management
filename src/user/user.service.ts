import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(email: string, username: string, password: string) {
    const user = this.userRepository.create({
      email,
      username,
      password,
    });

    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOneById(id: string) {
    if (!id) {
      return null;
    }
    const user = await this.userRepository.findOne({
      where: { id },
    });
    return user;
  }

  async findOneByEmail(email: string) {
    if (!email) {
      return null;
    }
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(id: string) {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.softRemove(user);
    return { success: true, message: id };
  }
}
