import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { transports, format } from 'winston';
import { WinstonModule, utilities } from 'nest-winston';

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
    WinstonModule.forRoot({
      transports: [
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp({
              format: 'MMM-DD-YYYY HH:mm:ss',
            }),
            format.ms(),
            utilities.format.nestLike('ApiWompoShop', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
            format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
        new transports.File({
          filename: `logs/error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
        }),
        new transports.File({
          filename: 'logs/combined.log',
          format: format.combine(format.timestamp(), format.json()),
        }),
      ],
    }),
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
