import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { envs, SeedModule } from '@/common';
import { Product, Image, Size, Tag } from '@/entities';
import { ProductModule } from './product/product.module';
import { CustomerModule } from './customer/customer.module';
import { TransactionModule } from './transaction/transaction.module';
import { RequestTypeModule } from './request-type/request_type.module';
import { DeliveryModule } from './orders/delivery.module';
import { TransactionDetailModule } from './order-items/transaction-detail.module';
import { StockModule } from './stock/stock.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.postGresHost,
      port: envs.postGresPort,
      username: envs.postGresUser,
      password: envs.postGresPassword,
      database: envs.postGresDb,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product, Image, Size, Tag]),
    SeedModule,
    ProductModule,
    CustomerModule,
    TransactionModule,
    RequestTypeModule,
    DeliveryModule,
    TransactionDetailModule,
    StockModule,
    OrderModule,
    OrderItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
