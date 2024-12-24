import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestType } from './entities';
import { RequestTypeService } from './request-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([RequestType])],
  controllers: [],
  providers: [RequestTypeService],
  exports: [RequestTypeService],
})
export class RequestTypeModule {}
