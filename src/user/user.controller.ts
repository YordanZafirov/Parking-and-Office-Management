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
import {
  CreateUserDto,
  SignInDto,
  UpdatePasswordDto,
  UpdateProfilePictureDto,
} from './user.dto';
import { AuthService } from '../auth/auth.service';
import { Public } from '../utils/decorators/public/public.decorator';
import { UserRoles } from './user-role.enum';
import { Roles } from '../utils/decorators/role/roles.decorator';
import { RolesGuard } from '../utils/guards/roles.guard';

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
