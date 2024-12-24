import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { Product } from '@/product/entities';

interface Options {
  slug: string;
}

export const findProductBySlugUseCase = async (
  productRepository: Repository<Product>,
  options: Options,
) => {
  const { slug } = options;
  const product = await productRepository.findOne({
    relations: {
      images: true,
      sizes: {
        stocks: true,
      },
      tags: true,
      stocks: {
        size: true,
      },
    },
    where: { slug },
  });

  if (!product) {
    throw new NotFoundException('Not found product');
  }

  return product;
};
