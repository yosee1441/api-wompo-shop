import { Product } from '@/product/entities';
import { Pagination } from '@/common/pagination';

interface Options {
  total: number;
  page: number;
}

export const buildPaginationResponseUseCase = (
  results: Product[],
  options: Options,
): Pagination<Product[]> => {
  const { total, page } = options;
  return {
    results,
    meta: {
      total,
      page,
    },
  };
};
