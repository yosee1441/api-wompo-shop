import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { envs } from '@/common';
import { SeedModule } from '@/seed';
import { WompiModule } from '@/wompi/wompi.module';
import { ProductModule } from '@/product/product.module';
import { CustomerModule } from '@/customer/customer.module';
import { TransactionModule } from '@/transaction/transaction.module';
import { RequestTypeModule } from '@/request-type/request-type.module';
import { StockModule } from '@/stock/stock.module';
import { OrderModule } from '@/order/order.module';
import { OrderItemModule } from '@/order-item/order-item.module';

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
    WompiModule,
    SeedModule,
    ProductModule,
    CustomerModule,
    TransactionModule,
    RequestTypeModule,
    StockModule,
    OrderModule,
    OrderItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
