import {
  IsString,
  IsNumber,
  IsArray,
  IsDecimal,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Type } from 'class-transformer';

import { Image, Size, Tag } from '@/entities';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsDecimal()
  price: number;

  @IsNumber()
  inStock: number;

  @IsString()
  slug: string;

  @IsString()
  type: string;

  @IsString()
  gender: string;

  @IsArray()
  @Type(() => Image)
  images: Image[];

  @IsArray()
  @Type(() => Size)
  sizes: Size[];

  @IsArray()
  @Type(() => Tag)
  tags: Tag[];
}
