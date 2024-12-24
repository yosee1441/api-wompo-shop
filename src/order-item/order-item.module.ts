import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderItem } from './entities';
import { OrderItemService } from './order-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])],
  controllers: [],
  providers: [OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule {}
