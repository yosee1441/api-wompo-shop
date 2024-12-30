import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateStockDto } from './dto';
import { Stock } from './entities';
import { QueryRunner, Repository } from 'typeorm';
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

  async findOneByProductIdAndSizeId(
    productId: number,
    sizeId: number,
  ): Promise<Stock> {
    const stock = await findStockByProductAndSizeUseCase(this.stockRepository, {
      productId,
      sizeId,
    });
    return stock;
  }

  async restoreWithQueryRunner(
    queryRunner: QueryRunner,
    id: number,
    availableQuantity: number,
  ) {
    return await queryRunner.manager.update(Stock, id, {
      available_quantity: availableQuantity,
    });
  }

  async updateAvailableQuantity(dto: UpdateStockDto): Promise<Stock> {
    const stock = await findStockByProductAndSizeUseCase(this.stockRepository, {
      productId: dto.productId,
      sizeId: dto.productId,
    });
    return await this.stockRepository.save({
      ...stock,
      available_quantity: stock.available_quantity - dto.quantity,
    });
  }

  async updateAvailableQuantityWithQueryRunner(
    queryRunner: QueryRunner,
    dto: UpdateStockDto,
  ): Promise<Stock> {
    const stock = await findStockByProductAndSizeUseCase(this.stockRepository, {
      productId: dto.productId,
      sizeId: dto.sizeId,
    });

    stock.available_quantity -= dto.quantity;

    return await queryRunner.manager.save(stock);
  }

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
}
