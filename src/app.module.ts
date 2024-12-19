import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { envs, SeedModule } from '@/common';
import { Product, Image, Size, Tag } from '@/entities';
import { ProductModule } from './products/product.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
