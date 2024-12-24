import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ProductService } from './product.service';
import { PaginationDto } from '@/common/pagination';
import { OneProduct, ProductSchema } from './swagger';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':slug')
  @ApiOperation({
    summary: 'Get find one by slug',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful Response',
    schema: {
      example: ProductSchema,
    },
  })
  findOneBySlug(@Param('slug') slug: string) {
    return this.productService.findOneBySlug(slug);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products with pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful Response',
    schema: {
      example: OneProduct,
    },
  })
  findAllPagination(@Query() dto: PaginationDto) {
    return this.productService.findAllPagination(dto);
  }
}
