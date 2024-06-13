import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { User } from 'src/users/entities/user.entity';
import { JwtGuard } from 'src/auth/jwt-auth.guard';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get(':id')
  async getWishlistById(@Param('id') wishId: string): Promise<Wishlist> {
    return await this.wishlistsService.findOneById(Number(wishId));
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Req() { user }: { user: User },
    @Body() dto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.create(dto, user);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Req() { user }: { user: User },
    @Param('id') wishId: string,
    @Body() dto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.updateById(Number(wishId), user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(
    @Req() { user }: { user: User },
    @Param('id') id: number,
  ): Promise<Wishlist> {
    return await this.wishlistsService.removeById(id, user.id);
  }
}
