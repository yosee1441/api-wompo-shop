import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestType } from './entities';
import { RequestTypeService } from './request-type.service';
import { RequestTypeController } from './request-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RequestType])],
  controllers: [RequestTypeController],
  providers: [RequestTypeService],
})
export class RequestTypeModule {}
