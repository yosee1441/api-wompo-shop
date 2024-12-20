import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities';
import { CreateProductDto } from './dto';
import { PaginationDto, Pagination } from '@/common/pagination';

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
    const { limit, page } = dto;
    const [results, total] = await this.productsRepository.findAndCount({
      relations: {
        images: true,
        sizes: true,
        tags: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      results,
      meta: {
        total,
        page,
      },
    };
  }

  async updateInStock(id: number, inStock: number): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });

    if (product) {
      product.inStock = inStock;
      return this.productsRepository.save(product);
    }

    throw new Error('Product not found');
  }
}
