import { plainToInstance } from 'class-transformer';
import { Product } from '@/product/entities';

export const transformProductsUseCase = (products: Product[] | null) => {
  if (!products) return products;

  return plainToInstance(Product, products);
};

export const transformProductUseCase = (product: Product | null) => {
  if (!product) return product;

  return plainToInstance(Product, product);
};
