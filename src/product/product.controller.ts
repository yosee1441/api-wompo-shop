import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto';
import { PaginationDto } from '@/common/pagination';
import { ProductSchema } from './swagger';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products with pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful Response',
    schema: {
      example: ProductSchema,
    },
  })
  findAllPagination(@Query() dto: PaginationDto) {
    return this.productService.findAllPagination(dto);
  }
}
