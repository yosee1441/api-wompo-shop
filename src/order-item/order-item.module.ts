import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderItem } from './entities';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { WompiModule } from '@/wompi/wompi.module';
import { OrderModule } from '@/order/order.module';
import { StockModule } from '@/stock/stock.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem]),
    WompiModule,
    OrderModule,
    StockModule,
  ],
  controllers: [OrderItemController],
  providers: [OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule {}
