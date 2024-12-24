import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities';
import { PaginationDto, Pagination } from '@/common/pagination';
import {
  paginatedProductsUseCase,
  buildPaginationResponseUseCase,
  findProductBySlugUseCase,
  transformProductsUseCase,
  transformProductUseCase,
  calculateStockForSizesUseCase,
} from './use-cases';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findOneBySlug(slug: string) {
    const product = await findProductBySlugUseCase(this.productsRepository, {
      slug,
    });
    return transformProductUseCase(calculateStockForSizesUseCase(product));
  }

  async findAllPagination(dto: PaginationDto): Promise<Pagination<Product[]>> {
    const [results, total] = await paginatedProductsUseCase(
      this.productsRepository,
      dto,
    );

    return buildPaginationResponseUseCase(transformProductsUseCase(results), {
      total,
      page: dto.page,
    });
  }
}
