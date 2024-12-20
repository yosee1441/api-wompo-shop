import { Repository } from 'typeorm';

import { Product } from '@/product/entities';

interface Options {
  page?: number;
  limit?: number;
}

export const paginatedProductsUseCase = async (
  productRepository: Repository<Product>,
  options: Options,
) => {
  const { limit, page } = options;

  return await productRepository.findAndCount({
    relations: {
      images: true,
      sizes: true,
      tags: true,
    },
    skip: (page - 1) * limit,
    take: limit,
  });
};
