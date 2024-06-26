import {
  IsString,
  Length,
  IsUrl,
  IsArray,
  IsNumber,
  IsOptional,
  Max,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];

  @IsOptional()
  @IsString()
  @Max(1500)
  description?: string;
}
