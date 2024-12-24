import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedService } from './seed.service';
import { Image, Size, Tag } from '@/entities';
import { Product } from '@/product/entities';
import { Stock } from '@/stock/entities';
import { Customer } from '@/customer/entities';
import { RequestType } from '@/request-type/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestType,
      Customer,
      Product,
      Stock,
      Image,
      Size,
      Tag,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
