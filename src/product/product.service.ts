import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities';
import { CreateProductDto } from './dto';
import { PaginationDto, Pagination } from '@/common/pagination';
import {
  paginatedProductsUseCase,
  buildPaginationResponseUseCase,
} from './use-cases';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  create(dto: CreateProductDto): Promise<Product> {
    return this.productsRepository.save(dto);
  }

  async findAllPagination(dto: PaginationDto): Promise<Pagination<Product[]>> {
    const [results, total] = await paginatedProductsUseCase(
      this.productsRepository,
      dto,
    );
    return buildPaginationResponseUseCase(results, { total, page: dto.page });
  }
}
