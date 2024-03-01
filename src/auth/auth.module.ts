import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5h' },
    }),
  ],
  controllers: [UserController],
  providers: [AuthService, UserService],
  exports: [AuthService],
})
export class AuthModule {}
