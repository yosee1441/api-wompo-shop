import { Module } from '@nestjs/common';
import { RequestTypeService } from './request_type.service';
import { RequestTypeController } from './request_type.controller';

@Module({
  controllers: [RequestTypeController],
  providers: [RequestTypeService],
})
export class RequestTypeModule {}
