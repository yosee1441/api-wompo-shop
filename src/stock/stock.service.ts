import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateStockDto } from './dto/update-stock.dto';
import { Stock } from './entities';
import { Repository } from 'typeorm';
import { AvailabilityResponse } from './interfaces';
import {
  findStockByProductAndSizeUseCase,
  checkStockQuantityUseCase,
} from './use-cases';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async checkStockAvailability(
    productId: number,
    sizeId: number,
    quantity: number,
  ): Promise<AvailabilityResponse> {
    const stock = await findStockByProductAndSizeUseCase(this.stockRepository, {
      productId,
      sizeId,
    });

    return checkStockQuantityUseCase(stock, quantity);
  }

  update(id: number, updateStockDto: UpdateStockDto) {
    return `This action updates a #${id} stock, ${updateStockDto}`;
  }
}
