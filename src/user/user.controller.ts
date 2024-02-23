import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/utils/decorators/public/public.decorator';
import { UserRoles } from './user-role.enum';
import { SignInDto } from './dto/sign-in.dto';
import { Roles } from 'src/utils/decorators/role/roles.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Roles(UserRoles.ADMIN)
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }
  @Public()
  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Roles(UserRoles.ADMIN)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Roles(UserRoles.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findOneById(id);
    const { email, imgUrl, role } = user;
    return { id, email, imgUrl, role };
  }
  @Patch('change-password/:id')
  async updatePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.authService.changePassword(id, updatePasswordDto);
  }
  @Patch('change-picture/:id')
  async updateProfilePicture(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProfilePictureDto: UpdateProfilePictureDto,
  ) {
    return await this.userService.updateProfilePicture(
      id,
      updateProfilePictureDto,
    );
  }

  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.remove(id);
  }
}
