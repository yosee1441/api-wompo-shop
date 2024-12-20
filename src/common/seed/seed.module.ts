import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedService } from './seed.service';
import { Image, Size, Tag } from '@/entities';
import { Product } from '@/product/entities';
import { Stock } from '@/stock/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Stock, Image, Size, Tag])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
