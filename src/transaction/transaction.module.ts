import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';

import { Transaction } from './entities';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { WompiModule } from '@/wompi/wompi.module';
import { ProductModule } from '@/product/product.module';
import { RequestTypeModule } from '@/request-type/request-type.module';
import { OrderModule } from '@/order/order.module';
import { OrderItemModule } from '@/order-item/order-item.module';
import { StockModule } from '@/stock/stock.module';
import { CustomerModule } from '@/customer/customer.module';

@Module({
  imports: [
    WinstonModule,
    TypeOrmModule.forFeature([Transaction]),
    WompiModule,
    ProductModule,
    RequestTypeModule,
    OrderModule,
    OrderItemModule,
    StockModule,
    CustomerModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
