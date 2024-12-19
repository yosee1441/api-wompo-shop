import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product, Image, Size, Tag } from '@/entities';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Image, Size, Tag])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
