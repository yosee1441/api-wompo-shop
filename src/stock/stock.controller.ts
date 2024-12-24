import { Controller, Get, Body, Patch, Param, Query } from '@nestjs/common';

import { StockService } from './stock.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { AvailabilityResponse } from './interfaces';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('availability')
  checkStockAvailability(
    @Query('product') productId: number,
    @Query('size') size: number,
    @Query('quantity') quantity: number,
  ): Promise<AvailabilityResponse> {
    return this.stockService.checkStockAvailability(productId, size, quantity);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.update(+id, updateStockDto);
  }
}
