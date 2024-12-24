import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { WompiService } from './wompi.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [WompiService],
  exports: [WompiService],
})
export class WompiModule {}
