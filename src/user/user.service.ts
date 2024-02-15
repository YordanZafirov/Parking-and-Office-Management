import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOneById(id: string) {
    if (!id) {
      return null;
    }
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }
    return user;
  }

  async findOneByEmail(email: string) {
    if (!email) {
      return null;
    }
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }
    return user;
  }
  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = this.userRepository.create({
      email,
      password,
    });

    const createdUser = await this.userRepository.save(user);
    return createdUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
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
