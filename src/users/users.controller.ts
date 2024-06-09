import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAll();
    const preparedUsers = users.map((user) => {
      delete user.password;
      return user;
    });
    return preparedUsers;
  }

  @Get('me')
  async getAuthUser(@Req() { user }: { user: User }): Promise<User> {
    const userData = await this.usersService.findById(user.id);
    if (!userData) {
      throw new NotFoundException('Пользователь не существует!');
    }

    delete userData.password;

    return userData;
  }

  @Patch('me')
  async updateAuthUser(
    @Req() { user }: { user: User },
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.usersService.updateById(user.id, dto);

    delete updatedUser.password;

    return updatedUser;
  }

  @Get('me/wishes')
  async getAuthUserWishes(@Req() { user }: { user: User }) {
    return await this.usersService.getUserWishes(user.username);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('Пользователь с таким именем не существует');
    }

    delete user.password;
    delete user.email;

    return user;
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    return await this.usersService.getUserWishes(username);
  }

  @Post('find')
  async findUsers(@Body('query') query: string): Promise<User[]> {
    const users = await this.usersService.findMany(query);

    if (!users) {
      throw new NotFoundException('Пользователи не найдены');
    }

    //delete user.password;

    return users;
  }
}
