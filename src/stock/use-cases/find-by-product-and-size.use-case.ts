import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Stock } from '@/stock/entities';

interface Options {
  productId: number;
  sizeId: number;
}

export const findStockByProductAndSizeUseCase = async (
  stockRepository: Repository<Stock>,
  options: Options,
): Promise<Stock> => {
  const { productId, sizeId } = options;
  const stock = stockRepository.findOne({
    where: {
      product: { id: productId },
      size: { id: sizeId },
    },
  });

  if (!stock) {
    throw new NotFoundException('Not found product with size');
  }

  return stock;
};
