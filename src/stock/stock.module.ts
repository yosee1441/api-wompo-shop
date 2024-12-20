import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Stock } from './entities';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
