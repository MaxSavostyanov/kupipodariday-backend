import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Like, Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    return this.usersRepository.save({
      ...dto,
      //password: ,
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async findMany(query: string): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ username: Like(`${query}%`) }, { email: Like(`${query}%`) }],
    });
  }

  async updateById(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (dto.email && dto.email !== user.email) {
      const foundedUserByEmail = await this.findByEmail(dto.email);
      if (foundedUserByEmail) {
        throw new BadRequestException('Email уже занят другим пользователем!');
      }
    }

    if (dto.username && dto.username !== user.username) {
      const foundedUserByUsername = await this.findByUsername(dto.username);
      if (foundedUserByUsername) {
        throw new BadRequestException('Имя уже занято другим пользователем!');
      }
    }

    if (dto.password) {
      //dto.password = await this.hashService.createHash(dto.password);
    }

    await this.usersRepository.update(id, dto);

    return await this.findById(id);
  }

  async getUserWishes(username: string): Promise<Wish[]> {
    const user = await this.findByUsername(username);

    if (!user) {
      throw new NotFoundException('Пользователя с таким именем нет');
    }

    const { id } = user;
    const { wishes } = await this.usersRepository.findOne({
      where: { id },
      select: ['wishes'],
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
    });

    for (const wish of wishes) {
      delete wish.owner.password;
      delete wish.owner.email;
    }

    return wishes;
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
}
