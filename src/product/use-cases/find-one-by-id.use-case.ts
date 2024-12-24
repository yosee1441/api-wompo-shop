import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { Product } from '@/product/entities';

interface Options {
  id: number;
}

export const findOneByIdUseCase = async (
  productRepository: Repository<Product>,
  options: Options,
): Promise<Product> => {
  const { id } = options;
  const product = await productRepository.findOne({ where: { id: id } });

  if (!product) {
    throw new NotFoundException('Not found product');
  }

  return product;
};
